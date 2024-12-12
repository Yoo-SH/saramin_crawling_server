import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class PerformanceLoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(PerformanceLoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // 요청 정보를 가져옵니다.
        const req = context.switchToHttp().getRequest();
        const { method, url } = req;
        const startTime = Date.now(); // 요청 시작 시간 기록

        this.logger.log(`Incoming Request: [${method}] ${url}`);

        return next.handle().pipe(
            tap(() => {
                const endTime = Date.now(); // 응답이 끝난 시간 기록
                const responseTime = endTime - startTime; // 총 소요 시간 계산


                if (responseTime > 500) {
                    this.logger.warn(
                        `Slow Response Detected: [${method}] ${url} - Response Time: ${responseTime}ms`,
                    );
                } else {
                    this.logger.log(
                        `Outgoing Response: [${method}] ${url} - Response Time: ${responseTime}ms`,
                    );
                }
            }),
        );
    }
}
