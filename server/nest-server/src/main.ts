
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './config/app.module';
import * as cookieParser from 'cookie-parser';
import { BadRequestException } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exception-filter/http-exception.filter';
import { PerformanceLoggingInterceptor } from './common/interceptor/performance-logging.interceptor';
import { Logger } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'], // 모든 로그 레벨 활성화
  });

  app.useGlobalPipes(new ValidationPipe({
    // 1. whitelist: 요청에서 DTO에 없는 속성을 자동으로 제거합니다.(forbidNonWhitelisted 이나 둘 중 하나만 사용해도.)
    whitelist: true,

    // 2. forbidNonWhitelisted: 요청에 DTO에 없는 속성이 있을 경우 요청을 거부합니다.
    forbidNonWhitelisted: true,

    // 3. transform: 요청 데이터를 DTO 클래스의 타입에 맞춰 자동 변환합니다.
    //예를 들어, 클라이언트가 문자열 "25"를 전송했을 때, 이 값이 DTO에서 @IsInt() 데코레이터로 정의되어 있으면 자동으로 정수형으로 변환됩니다.
    transform: true,

    // 4. exceptionFactory: 검증 실패 시 반환되는 에러 메시지를 커스터마이징합니다.
    exceptionFactory: (errors) => {
      const messages = errors.map((error) => {
        const constraints = Object.values(error.constraints);
        const translatedMessages = constraints.map((message) => {
          // 영어 메시지를 한글로 번역
          if (message.includes('should not be empty')) {
            return `${error.property} 필드는 비워둘 수 없습니다.`;
          } else if (message.includes('must be a string')) {
            return `${error.property} 필드는 문자열이어야 합니다.`;
          } else if (message.includes('must be an email')) {
            return `${error.property} 필드는 유효한 이메일 형식이어야 합니다.`;
          } else if (message.includes('must be a number conforming to the specified constraints')) {
            return `${error.property} 필드는 숫자여야 합니다.`;
          } else if (message.includes('must be an integer number')) {
            return `${error.property} 필드는 정수여야 합니다.`;
          } else if (message.includes('must be a boolean value')) {
            return `${error.property} 필드는 불리언 값이어야 합니다.`;
          } else if (message.includes('must be a date accept')) {
            return `${error.property} 필드는 날짜여야 합니다.`;
          } else if (message.includes('must be an URL address')) {
            return `${error.property} 필드는 유효한 URL 형식이어야 합니다.`;
          }
          // 기본 메시지 사용 (기타 케이스)
          return message;
        });

        return translatedMessages.join(', ');
      });

      return new BadRequestException(messages);
    },
  }),
  ); // 유효성 검사 파이프 설정

  app.use(cookieParser()); // 쿠키 파서 사용
  app.enableCors(
    {
      origin: true, //모든 도메인 허용, 나중에는 allupkorea 이라는 도메인만 허용하도록 변경
      credentials: true, //쿠키 전송 허용
    }
  )

  // 성능 모니터링 인터셉터 등록
  app.useGlobalInterceptors(new PerformanceLoggingInterceptor());

  // 글로벌 예러 핸들러 필터 등록
  app.useGlobalFilters(new HttpExceptionFilter());


  await app.listen(process.env.PORT ?? 3000);
  Logger.log(`Server running on http://localhost:${process.env.PORT ?? 3000}`, 'Bootstrap');
}
bootstrap();
