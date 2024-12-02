# saramin_server

## API 형식
```
성공시 API
{
    message: "회원가입에 성공했습니다"
    data: {
        email:
        name:
    }
    statusCode: 201
}

실패시 API 
{
    message: "회원가입에 실패했습니다"
    error: "Bad request"
    statusCode: 400
}
```

## 예외 클래스들 (HttpException)
* NestJS는 HTTP 상태 코드와 메시지를 제공할 수 있는 다양한 예외 클래스를 제공합니다. 이러한 예외들은 @nestjs/common에서 제공되며, 서비스나 컨트롤러에서 에러가 발생했을 때 이 클래스를 사용하여 클라이언트에게 일관된 응답을 줄 수 있습니다.

*  HttpException: 모든 예외의 기본 클래스입니다.
    - throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    - HTTP 상태 코드: 403 (Forbidden)

* BadRequestException: 잘못된 요청일 때 사용됩니다.
    - throw new BadRequestException('Invalid data');
    - HTTP 상태 코드: 400 (Bad Request)

* UnauthorizedException: 인증 실패 시 사용됩니다.
    - throw new UnauthorizedException('Unauthorized access');
    - HTTP 상태 코드: 401 (Unauthorized)
* NotFoundException: 요청된 리소스가 없을 때 사용됩니다.
    - throw new NotFoundException('Resource not found');
    - HTTP 상태 코드: 404 (Not Found)

* ForbiddenException: 액세스 권한이 없는 경우 사용됩니다.
    - throw new ForbiddenException('Access is forbidden');
    - HTTP 상태 코드: 403 (Forbidden)
    
* ConflictException: 데이터가 충돌할 때 사용됩니다.
    - throw new ConflictException('Data conflict');
    - HTTP 상태 코드: 409 (Conflict)

* InternalServerErrorException: 서버 내부 에러 발생 시 사용됩니다.
    - throw new InternalServerErrorException('Internal server error');
    - HTTP 상태 코드: 500 (Internal Server Error)

* NotAcceptableException : 요청된 리소스를 처리할 수 없는 경우 사용됩니다.
    - HTTP 상태 코드: 406 (Not Acceptable)

* RequestTimeoutException : 요청 시간이 초과된 경우 사용됩니다.
    -  HTTP 상태 코드: 408 (Request Timeout)

* PayloadTooLargeException :요청 페이로드가 너무 큰 경우 사용됩니다.
    - HTTP 상태 코드: 413 (Payload Too Large)











