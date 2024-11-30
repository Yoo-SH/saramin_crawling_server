import { Injectable, HttpException, HttpStatus, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner, DataSource } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from '../users/entity/users.entity';
import { Auth } from './entity/auth.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users) private readonly repo_users: Repository<Users>,
        @InjectRepository(Auth) private readonly repo_auth: Repository<Auth>,
        private readonly dataSource: DataSource,
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
            auth.password = password;

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
}
