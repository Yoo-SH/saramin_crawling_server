import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entity/auth.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Auth]) // Auth 엔티티의 리포지토리 등록
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
