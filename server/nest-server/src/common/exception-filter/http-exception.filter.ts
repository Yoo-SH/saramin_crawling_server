// http-exception.filter.ts
import {
    ExceptionFilter,  // ExceptionFilter 인터페이스는 필터가 구현해야 하는 기본 메서드를 정의합니다.
    Catch,             // @Catch 데코레이터는 특정 예외를 잡기 위해 사용됩니다.
    ArgumentsHost,     // ArgumentsHost는 핸들러에 전달된 인수를 캡슐화합니다.
    HttpException,     // HttpException은 기본 HTTP 예외 처리를 위한 NestJS 클래스입니다.
    HttpStatus,        // HttpStatus는 HTTP 상태 코드를 정의한 열거형(Enum)입니다.
} from '@nestjs/common';
import { Request, Response } from 'express'; // Express의 Request와 Response 객체를 사용하기 위해 임포트합니다.

// @Catch() 데코레이터는 모든 예외를 잡겠다고 명시합니다.
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    // ExceptionFilter 인터페이스의 catch 메서드를 구현합니다.
    catch(exception: unknown, host: ArgumentsHost) {
        // 현재 처리하고 있는 HTTP 요청/응답을 얻기 위해 host 객체에서 HTTP 관련 컨텍스트를 가져옵니다.
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>(); // 클라이언트로 응답을 보내기 위한 Response 객체를 가져옵니다.
        const request = ctx.getRequest<Request>();    // 요청 정보를 확인하기 위한 Request 객체를 가져옵니다.

        // 예외가 HttpException인지 여부에 따라 다른 방식으로 상태 코드와 메시지를 설정합니다.
        let status: number;
        let message: string;

        if (exception instanceof HttpException) {
            // 예외가 HttpException일 경우, 예외로부터 상태 코드와 응답 메시지를 가져옵니다.
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            // 응답 메시지가 문자열인 경우 그대로 사용하고, 객체일 경우 내부의 메시지를 사용합니다.
            message = typeof exceptionResponse === 'string'
                ? exceptionResponse
                : (exceptionResponse as any).message;
        } else {
            // 예외가 HttpException이 아닌 경우, 내부 서버 오류로 처리하고 기본 메시지를 설정합니다.
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Internal server error';
        }

        // 클라이언트에게 JSON 형식으로 에러 응답을 보냅니다.
        response.status(status).json({
            status: "error",                 // HTTP 상태 코드
            message,                       // 예외 메시지
            statusCode: status,            // HTTP 상태 코드
        });
    }
}
