import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // 환경 변수 모듈과 서비스를 가져옴
import { UsersModule } from 'src/module/users/users.module';
import { AuthModule } from 'src/module/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'), // 환경 변수 DB_HOST 사용
        port: parseInt(configService.get('DB_PORT'), 10), // 환경 변수 DB_PORT 사용, 문자열을 숫자로 변환
        username: configService.get<string>('DB_USERNAME'), // 환경 변수 DB_USERNAME 사용
        password: configService.get<string>('DB_PASSWORD'), // 환경 변수 DB_PASSWORD 사용
        database: configService.get<string>('DB_DATABASE'), // 환경 변수 DB_DATABASE 사용
        entities: [__dirname + '/../**/*.entity.{js,ts}'], // 엔티티 파일 경로
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE'), // true로 설정하면 데이터베이스가 자동으로 동기화됨 (주의: 실제 운영 환경에서는 false로 설정 권장)

      }),
    }),
    UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
