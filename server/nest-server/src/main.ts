
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './config/app.module';
import * as cookieParser from 'cookie-parser';
import { BadRequestException } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exception-filter/http-exception.filter';
import { PerformanceLoggingInterceptor } from './common/interceptor/performance-logging.interceptor';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {


  const app = await NestFactory.create(AppModule,);

  // 로그 레벨을 환경 변수에서 가져와서 설정
  const configService = app.get(ConfigService);
  const logLevels = configService.get<string>('LOG_LEVEL').split(',');
  app.useLogger(logLevels as any); // useLogger의 타입과 맞추기 위해 any로 캐스팅

  const swaggerEnabled = configService.get<boolean>('SWAGGER_ENABLED');
  if (swaggerEnabled) {
    const swaggerPath = configService.get<string>('SWAGGER_PATH');

    // Swagger 설정
    const config = new DocumentBuilder()
      .setTitle('SARAMIN SERVER API')
      .setDescription('NestJS를 이용한 SARAMIN SERVER API 문서입니다.')
      .setVersion('1.0')
      .addApiKey(
        {
          type: 'apiKey',
          name: 'access_token', // 쿠키 이름
          in: 'cookie', // 쿠키에서 읽는다는 것을 명시
        },
        'cookieAuth', // 인증 스키마 이름
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerPath, app, document);
  }

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
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true, //쿠키 전송 허용
    }
  )


  // 글로벌 예러 핸들러 필터 등록
  app.useGlobalFilters(new HttpExceptionFilter());
  // 성능 모니터링 인터셉터 등록
  app.useGlobalInterceptors(new PerformanceLoggingInterceptor());


  await app.listen(configService.get<number>('PORT') ?? 3000);
  Logger.log(`Server running on http://localhost:${configService.get<number>('PORT') ?? 3000}`, 'Bootstrap');
  console.log(`Server running on http://localhost:${configService.get<number>('PORT') ?? 3000}`);

}
bootstrap();
