import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/module/users/users.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly usersService: UsersService,
        private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                // 요청에서 쿠키로부터 JWT를 추출
                return request?.cookies?.access_token;
            }]),
            ignoreExpiration: false, // 만료된 JWT 토큰을 허용할지 여부
            secretOrKey: configService.get<string>('ACCESS_SECRET_KEY'), // JWT 토큰을 검증하기 위한 비밀 키
        });
    }

    /*validate(): JWT가 유효한 경우, 토큰의 페이로드를 처리하고 사용자 객체를 반환하는 역할을 합니다.*/
    //토큰이 유효하면 호출됨: JWT 토큰이 만료되지 않았고 서명 검증에 성공하면 validate() 메서드가 호출됩니다.
    //예를 들어, JWT가 유효하다고 해서 무조건 그 사용자가 서버에 실제 존재하는 유효한 사용자라는 보장이 있는 것은 아닙니다. 따라서 validate() 메서드에서 추가적으로 데이터베이스에서 사용자를 조회하여 존재 여부를 확인할 수 있습니다.
    async validate(payload: any) {
        const user = await this.usersService.findById(payload.user_id); // 사용자 ID로 사용자 조회

        if (!user) {
            throw new UnauthorizedException("토큰에 해당하는 사용자가 존재하지 않습니다."); // 사용자가 존재하지 않으면 예외 처리
        }

        // req.user: validate()에서 반환된 객체는 req.user에 할당되어, 이후 요청을 처리하는 곳에서 사용될 수 있습니다.
        // ex)  @UseGuards(JwtAuthGuard)
        //      @Get()
        //      getProfile(@Request() req) {
        //      console.log(req.user.id); 
        //      return { userId: req.user.id}
        return { id: user.id };
    }
}
