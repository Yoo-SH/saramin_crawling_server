import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Users } from './entity/users.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(Users) private repo_user: Repository<Users>) { }

    /*사용자 ID로 사용자 조회*/
    async findById(user_id: number) {
        const user = await this.repo_user.findOne({ where: { id: user_id } });

        if (!user) {
            throw new NotFoundException(`해당 id의 사용자가 존재하지 않습니다.`);
        }

        return user;
    }
}
