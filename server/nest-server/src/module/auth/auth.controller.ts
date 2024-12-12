import { Body, Controller, Post, Put, Res, UseGuards, Req, Delete } from '@nestjs/common';
import { CreateUserDto } from './dto/request/create-user.dto';
import { CreateLoginDto } from './dto/request/create-login.dto';
import { AuthService } from './auth.service';
import { CreateRefreshDto } from './dto/request/create-refresh.dto';
import { Response, Request } from 'express';
import { JwtAuthGuard } from 'src/common/guard/jwt.auth.guard';
import { UpdateProfileDto } from './dto/request/update-profile.dto';
import { DeleteUserDto } from './dto/request/delete-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { ResponsePostAuthRegisterDto } from './dto/response/response-post-auth-register.dto';
import { ResponsePostAuthLoginDto } from './dto/response/response-post-auth-login.dto';
import { ResponsePostAuthRefreshDto } from './dto/response/response-post-auth-refresh.dto';
import { ResponsePutAuthProfileDto } from './dto/response/response-put-auth-profile.dto';
import { ResponseDeleteAuthProfileDto } from './dto/response/response-delete-auth-profile.dto';
import { ResponsePostAuthLogoutDto } from './dto/response/response-post-auth-logout.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiOperation({ summary: '회원가입' })
    @ApiResponse({ status: 201, description: '회원가입 성공', type: ResponsePostAuthRegisterDto })
    @ApiResponse({ status: 409, description: '이미 사용 중인 이름입니다.', type: ErrorResponseDto })
    @ApiResponse({ status: 409, description: '이미 사용 중인 이메일입니다.', type: ErrorResponseDto })
    @ApiResponse({ status: 500, description: '회원가입에 실패하였습니다.', type: ErrorResponseDto })
    @Post('register')
    async register(@Body() body: CreateUserDto) {
        return await this.authService.createUser(body);
    }

    @ApiOperation({ summary: '로그인' })
    @ApiResponse({ status: 200, description: '로그인 성공', type: ResponsePostAuthLoginDto })
    @ApiResponse({ status: 404, description: '등록되지 않은 이메일입니다.', type: ErrorResponseDto })
    @ApiResponse({ status: 404, description: '비밀번호가 일치하지 않습니다.', type: ErrorResponseDto })
    @ApiResponse({ status: 500, description: '로그인 중 오류가 발생했습니다.', type: ErrorResponseDto })
    @Post('login')
    async login(@Body() body: CreateLoginDto, @Res() res: Response) {
        return await this.authService.createLogin(body, res);
    }

    @ApiOperation({ summary: '로그아웃' })
    @ApiResponse({ status: 200, description: '로그아웃 되었습니다.', type: ResponsePostAuthLogoutDto })
    @ApiResponse({ status: 500, description: '로그아웃 중 오류가 발생했습니다.', type: ErrorResponseDto })
    @ApiSecurity('cookieAuth')
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Req() req, @Res() res: Response) {
        return await this.authService.createLogout(req.user.id, req, res);
    }


    @ApiOperation({ summary: '토큰 갱신' }) // 401 응답 시 /auth/refresh 엔드포인트를 통해 새 Access Token을 요청하도록 클라이언트 측에서 처리
    @ApiResponse({ status: 200, description: '토큰이 갱신 되었습니다.', type: ResponsePostAuthRefreshDto })
    @ApiResponse({ status: 401, description: '유효하지 않은 토큰입니다.', type: ErrorResponseDto })
    @ApiResponse({ status: 401, description: 'Refresh token이 만료되었습니다. 다시 로그인 하세요.', type: ErrorResponseDto })
    @ApiResponse({ status: 404, description: '해당 유저를 찾을 수 없습니다. updateRefreshToken', type: ErrorResponseDto })
    @ApiResponse({ status: 500, description: '토큰 갱신 중 오류가 발생했습니다.', type: ErrorResponseDto })
    @Post('refresh')
    refresh(@Body() body: CreateRefreshDto, @Res() res: Response) {
        return this.authService.createNewAccessTokenByRefreshToken(body, res);
    }


    @ApiOperation({ summary: '프로필 수정' })
    @ApiResponse({ status: 200, description: '프로필이 수정되었습니다.', type: ResponsePutAuthProfileDto })
    @ApiResponse({ status: 404, description: '해당 유저를 찾을 수 없습니다.', type: ErrorResponseDto })
    @ApiResponse({ status: 409, description: '이미 사용 중인 이름입니다.', type: ErrorResponseDto })
    @ApiResponse({ status: 401, description: '비밀번호가 일치하지 않습니다.', type: ErrorResponseDto })
    @ApiResponse({ status: 500, description: '프로필 수정 중 오류가 발생했습니다.', type: ErrorResponseDto })
    @ApiSecurity('cookieAuth')
    @UseGuards(JwtAuthGuard)
    @Put('profile')
    updateProfile(@Req() req, @Body() body: UpdateProfileDto) {
        return this.authService.updateProfile(req.user.id, body);
    }

    @ApiOperation({ summary: '회원 탈퇴' })
    @ApiResponse({ status: 200, description: '회원 탈퇴가 완료되었습니다.', type: ResponseDeleteAuthProfileDto })
    @ApiResponse({ status: 404, description: '해당 유저를 찾을 수 없습니다.', type: ErrorResponseDto })
    @ApiResponse({ status: 404, description: '인증 정보를 찾을 수 없습니다.', type: ErrorResponseDto })
    @ApiResponse({ status: 401, description: '비밀번호가 일치하지 않습니다.', type: ErrorResponseDto })
    @ApiResponse({ status: 500, description: '회원 탈퇴 중 오류가 발생했습니다.', type: ErrorResponseDto })
    @ApiSecurity('cookieAuth')
    @UseGuards(JwtAuthGuard)
    @Delete('profile')
    deleteUser(@Req() req, @Body() body: DeleteUserDto) {
        return this.authService.deleteUser(req.user.id, body);
    }
}
