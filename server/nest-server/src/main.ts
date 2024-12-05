
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './config/app.module';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/exception-filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // 유효성 검사 파이프 설정
  app.use(cookieParser()); // 쿠키 파서 사용
  app.enableCors(
    {
      origin: true, //모든 도메인 허용, 나중에는 allupkorea 이라는 도메인만 허용하도록 변경
      credentials: true, //쿠키 전송 허용
    }
  )
  0
  // 글로벌 필터 등록
  app.useGlobalFilters(new HttpExceptionFilter());


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
