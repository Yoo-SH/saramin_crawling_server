import { Injectable, HttpException, HttpStatus, ConflictException, NotFoundException, UnauthorizedException, InternalServerErrorException, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner, DataSource, In } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateLoginDto } from './dto/create-login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Users } from '../users/entity/users.entity';
import { Auth } from './entity/auth.entity';
import * as bcrypt from 'bcrypt'; // Add this line to fix the type error
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateRefreshDto } from './dto/create-refresh.dto';
import { Response } from 'express';

interface Token {
    accessToken: string; //액세스 토큰
    refreshToken: string; //리프레시 토큰
}


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users) private readonly repo_users: Repository<Users>,
        @InjectRepository(Auth) private readonly repo_auth: Repository<Auth>,
        private jwtService: JwtService, // JWT 토큰을 생성 및 검증하기 위한 JwtService 주입
        private readonly dataSource: DataSource, // QueryRunner를 생성하기 위한 DataSource 주입(트랜잭션 사용)
        private readonly configService: ConfigService, // 환경 변수를 사용하기 위한 ConfigService 주입
    ) { }

    async createUser(createUserDto: CreateUserDto) {
        const { user_name, email, password } = createUserDto;


        // 중복된 name 체크
        const existingUser = await this.repo_users.findOne({ where: { name: user_name } });
        if (existingUser) {
            throw new ConflictException('이미 사용 중인 이름입니다.');
        }

        // 중복된 email 체크
        const existingEmail = await this.repo_auth.findOne({ where: { email } });
        if (existingEmail) {
            throw new ConflictException('이미 사용 중인 이메일입니다.');
        }

        const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

        // QueryRunner 연결 설정
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Users 엔티티 생성
            const user = new Users();
            user.name = user_name;

            // Users 엔티티 저장 (트랜잭션 사용)
            const savedUser = await queryRunner.manager.save(user);

            // Auth 엔티티 생성 및 Users 엔티티 연결
            const auth = new Auth();
            auth.user = savedUser;
            auth.email = email;
            auth.password = await this.hashPassword(password);

            // Auth 엔티티 저장 (트랜잭션 사용)
            await queryRunner.manager.save(auth);

            // 모든 작업 성공 시 커밋
            await queryRunner.commitTransaction();

            return {
                message: '회원가입을 성공하였습니다.',
                data: { username: savedUser.name, email: auth.email },
                statusCode: HttpStatus.CREATED,
            };
        } catch (error) {
            // 에러 발생 시 롤백
            await queryRunner.rollbackTransaction();
            throw new HttpException(
                {
                    message: '회원가입에 실패하였습니다.',
                    error: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );

        } finally {
            // QueryRunner 해제
            await queryRunner.release();
        }
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }

    async createLogin(createLoginDto: CreateLoginDto, @Res() res: Response) {
        try {
            const { email, password } = createLoginDto;

            const auth = await this.repo_auth.findOne({
                where: { email }, relations: ['user'],
            });
            if (!auth) {
                throw new NotFoundException('등록되지 않은 이메일입니다.');
            }

            const isValidPassword = await bcrypt.compare(password, auth.password);
            if (!isValidPassword) {
                throw new NotFoundException('비밀번호가 일치하지 않습니다.');
            }

            const tokens = await this.generateToken(auth.user.id);
            await this.saveRefreshToken(auth.user.id, tokens.refreshToken);

            // 로그인 이력 저장
            auth.user.lastLoginAt = new Date();
            await this.repo_users.save(auth.user);
            console.log(new Date());

            // 쿠키 설정
            res.cookie('access_token', tokens.accessToken, {
                httpOnly: true,
                secure: this.configService.get<boolean>("COOKIE_ACCESS_HTTPS"), //https에서만 쿠키 전송할지 여부
                maxAge: this.configService.get<number>("COOKIE_ACCESS_EXPIRES_IN"),
            });

            res.cookie('refresh_token', tokens.refreshToken, {
                httpOnly: true,
                secure: this.configService.get<boolean>("COOKIE_REFRESH_HTTPS"), //https에서만 쿠키 전송할지 여부
                maxAge: this.configService.get<number>("COOKIE_REFRESH_EXPIRES_IN"),
            });

            //@Res()를 사용할 때는 몇 가지 점을 고려해야 합니다:
            //1 @Res() 데코레이터를 사용하면 Express의 Response 객체를 사용할 수 있습니다.
            //2.@Res()를 사용하면 NestJS의 기본 자동 반환 메커니즘을 사용할 수 없습니다. 즉, 직접 res.status().json()과 같은 방식으로 응답을 전송해 주어야 합니다.
            return res.status(HttpStatus.OK).json({
                message: '로그인에 성공하였습니다.',
                data: { username: auth.user.name, email: auth.email },
                statusCode: HttpStatus.OK,
            });

        } catch (error) {
            if (error instanceof Error) {
                throw error
            }
            throw new InternalServerErrorException('로그인 중 오류가 발생했습니다.');
        }
    }

    async generateToken(user_id: Users['id']): Promise<Token> {
        // 액세스 토큰 생성 (15분 유효기간)
        const accessToken = this.jwtService.sign(
            { user_id: user_id }, // sub는 토큰 소유자의 ID를 나타내는 키를 sub로 설정
            //엑세스 토큰은 전역적으로 설정된 JWT_SECRET_KEY, EXPIRES_IN을 사용하여 생성, 가드 등에서 전역키로 사용가능
        );

        // 리프레시 토큰 생성 (7일 유효기간)
        const refreshToken = this.jwtService.sign(
            { user_id: user_id },
            { secret: this.configService.get<string>('REFRESH_SECRET'), expiresIn: this.configService.get<string>('REFRESH_EXPIRES_IN') },
        );

        return { accessToken, refreshToken }; // 생성된 토큰 반환
    }


    /* 리프레시 토큰을 사용자 DB에 저장하는 메소드*/
    async saveRefreshToken(user_id: Users['id'], refreshToken: string) {
        const user = await this.repo_users.findOne({ where: { id: user_id } });
        const auth = await this.repo_auth.findOne({ where: { user: { id: user_id } } });

        if (!user) {
            throw new NotFoundException('해당 유저를 찾을 수 없습니다. updateRefreshToken');
        }

        auth.refreshToken = refreshToken;
        return await this.repo_auth.save(auth);
    }


    /* 새로운 액세스 토큰 발급 메소드 */
    async createNewAccessTokenByRefreshToken(createRefreshDto: CreateRefreshDto, @Res() res: Response) {
        const { refreshToken } = createRefreshDto;

        try {
            // 리프레시 토큰의 유효성을 검증
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('REFRESH_SECRET'),
            });

            // 사용자 정보를 가져옵니다.
            const user = await this.repo_users.findOne({ where: { id: payload.user_id } });
            const auth = await this.repo_auth.findOne({ where: { user: { id: payload.user_id } } });

            // 사용자 또는 토큰이 유효하지 않을 경우, 인증 오류 발생
            if (!user || !auth.refreshToken || auth.refreshToken !== refreshToken) {
                console.log('refreshToken:', refreshToken);
                console.log('user.refreshToken:', auth.refreshToken);
                throw new UnauthorizedException('유효하지 않은 토큰입니다.');
            }

            // 새로운 액세스 및 리프레시 토큰을 생성합니다.
            const tokens = await this.generateToken(user.id);
            await this.saveRefreshToken(user.id, tokens.refreshToken); // 새로운 리프레시 토큰 저장

            // 쿠키 설정
            res.cookie('access_token', tokens.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: this.configService.get<number>('COOKIE_ACCESS_EXPIRES_IN'),
            });

            return res.status(HttpStatus.OK).json({
                message: '토큰이 갱신되었습니다.',
                data: {
                    username: user.name,
                },
                statusCode: HttpStatus.OK,
            });
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                if (error.name === 'TokenExpiredError') {
                    throw new UnauthorizedException('Refresh token이 만료되었습니다. 다시 로그인 하세요.');
                }
                throw error;
            }
            throw new InternalServerErrorException('토큰 갱신 중 오류가 발생했습니다.');
        }
    }

    /*리프레시 토큰을 삭제하는 메소드*/
    async removeRefreshToken(refreshToken: string) {
        const auth = await this.repo_auth.findOne({ where: { refreshToken } });
        if (!auth) {
            throw new NotFoundException('해당 유저를 찾을 수 없습니다. removeRefreshToken');
        }

        auth.refreshToken = null;
        return this.repo_auth.save(auth);
    }


    async updateProfile(user_id: Users['id'], updateProfileDto: UpdateProfileDto) {
        const { newName, currentPassword, newPassword } = updateProfileDto;

        const user = await this.repo_users.findOne({ where: { id: user_id } });
        if (!user) {
            throw new NotFoundException('해당 유저를 찾을 수 없습니다. updateProfile');
        }

        // 이름 변경을 선택했다면, 중복된 이름이 있는지 확인
        if (newName) {
            const existingUser = await this.repo_users.findOne({ where: { name: newName } });
            if (existingUser) {
                throw new ConflictException('이미 사용 중인 이름입니다.');
            }
            user.name = newName;
        }

        // 비밀번호 변경
        if (currentPassword && newPassword) {
            const auth = await this.repo_auth.findOne({ where: { user: { id: user_id } } });
            const isValidPassword = await bcrypt.compare(currentPassword, auth.password);
            if (!isValidPassword) {
                throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
            }
            auth.password = await this.hashPassword(newPassword);
            await this.repo_auth.save(auth);
        }

        return {
            message: '프로필이 수정되었습니다.',
            data: { username: user.name },
            statusCode: HttpStatus.OK,
        };
    }
}
