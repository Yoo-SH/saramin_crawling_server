import { Injectable, HttpCode, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Users } from './entity/users.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(Users) private repo_user: Repository<Users>) { }

    /*모든 사용자 조회*/
    async findAllUsers() {
        try {
            const users = await this.repo_user.find();

            if (!users) {
                throw new NotFoundException(`사용자가 존재하지 않습니다.`);
            }

            return {
                messege: "사용자 조회 성공",
                data: users,
                statusCode: HttpStatus.OK
            }

        } catch (error) {
            throw new InternalServerErrorException(`사용자 조회 중 오류가 발생했습니다.`);
        }
    }

    /*사용자 ID로 사용자 조회*/
    async findUsersById(user_id: number) {
        try {
            const user = await this.repo_user.findOne({ where: { id: user_id } });

            if (!user) {
                throw new NotFoundException(`해당 id의 사용자가 존재하지 않습니다.`);
            }

            return {
                messege: "사용자 조회 성공",
                data: {
                    user_id: user.id,
                    user_name: user.name
                },
                statusCode: HttpStatus.OK
            }

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`사용자 조회 중 오류가 발생했습니다.`);
        }

    }

    /*사용자 이름으로 사용자 조회*/
    async findUsersByName(user_name: string) {
        try {
            const user = await this.repo_user.findOne({ where: { name: user_name } });

            if (!user) {
                throw new NotFoundException(`해당 이름의 사용자가 존재하지 않습니다.`);
            }

            return {
                messege: "사용자 조회 성공",
                data: {
                    user_id: user.id,
                    user_name: user.name
                },
                statusCode: HttpStatus.OK
            }

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(`사용자 조회 중 오류가 발생했습니다.`);
        }
    }
}
