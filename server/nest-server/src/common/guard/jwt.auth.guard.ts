import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/*AuthGuard('jwt'): 'jwt'는 Passport가 사용할 전략 이름. */
/*Guard가 실행될 때 Passport의 JwtStrategy가 자동으로 호출되어 JWT 인증을 처리합니다.*/
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt')
{
    canActivate(context: ExecutionContext) {
        //super.canActivate(context): 부모 클래스(AuthGuard)의 생성자를 호출하여 Passport의 기본 인증 로직을 적용하며, 이를 통해 JWT 유효성 검사를 자동으로 처리합니다
        //AuthGuard 클래스의 canActivate 메서드는 요청이 인증을 통과하는지 여부를 결정합니다. 
        //이 메서드를 호출함으로써 기본적인 Passport 인증 로직을 실행하고, JWT의 유효성을 검사합니다.
        return super.canActivate(context);
    }
}
