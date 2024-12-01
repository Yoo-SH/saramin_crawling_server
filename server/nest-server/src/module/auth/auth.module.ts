import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entity/auth.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/common/strategy/jwtStrategy';

@Module({

  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule, TypeOrmModule.forFeature([Auth],
    )],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, TypeOrmModule]
})
export class AuthModule { }
