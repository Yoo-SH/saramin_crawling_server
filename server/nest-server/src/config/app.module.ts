import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // 환경 변수 모듈과 서비스를 가져옴
import { UsersModule } from 'src/module/users/users.module';
import { AuthModule } from 'src/module/auth/auth.module';
import { JobsModule } from 'src/module/jobs/jobs.module';
import { JwtModule } from '@nestjs/jwt';
import { BookmarksModule } from 'src/module/bookmarks/bookmarks.module';
import { ApplicationsModule } from 'src/module/applications/applications.module';

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


    JwtModule.registerAsync({
      imports: [ConfigModule], // ConfigModule을 주입하여 환경 변수 사용 가능
      inject: [ConfigService], // ConfigService를 통해 환경 변수 접근
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_SECRET_KEY'), // signature= payload + secret key by header(알고리즘)
        signOptions: {
          expiresIn: configService.get<string>('ACCESS_EXPIRES_IN'), // access token 만료 시간
        }, // 환경 변수에서 만료 시간 가져오기
      }),
      global: true, // 이 옵션을 사용하면 JwtModule을 글로벌로 설정하여 모든 모듈에서 사용 가능
    }),
    UsersModule, AuthModule, JobsModule, BookmarksModule, ApplicationsModule],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
