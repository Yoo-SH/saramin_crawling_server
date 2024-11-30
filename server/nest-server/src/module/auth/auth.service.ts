import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner, DataSource } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from '../users/entity/users.entity';
import { Auth } from './entity/auth.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users) private readonly repo_users: Repository<Users>,
        @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
        private readonly dataSource: DataSource,
    ) { }

    async createUser(createUserDto: CreateUserDto) {
        const { username, email, password } = createUserDto;
        const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

        // QueryRunner 연결 설정
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Users 엔티티 생성
            const user = new Users();
            user.name = username;

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

            return { message: '회원가입을 성공하였습니다.' };
        } catch (error) {
            // 에러 발생 시 롤백
            await queryRunner.rollbackTransaction();
            throw new HttpException(
                {
                    message: '회원가입을 실패하였습니다.',
                    error: error.message,
                },
                HttpStatus.BAD_REQUEST
            );
        } finally {
            // QueryRunner 해제
            await queryRunner.release();
        }
    }
}
