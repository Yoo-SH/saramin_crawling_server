import { Body, Controller, Post, Put, Res, UseGuards, Req, Delete } from '@nestjs/common';
import { CreateUserDto } from './dto/request/create-user.dto';
import { CreateLoginDto } from './dto/request/create-login.dto';
import { AuthService } from './auth.service';
import { CreateRefreshDto } from './dto/request/create-refresh.dto';
import { Response, Request } from 'express';
import { JwtAuthGuard } from 'src/common/guard/jwt.auth.guard';
import { UpdateProfileDto } from './dto/request/update-profile.dto';
import { DeleteUserDto } from './dto/request/delete-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponsePostAuthRegisterDto } from './dto/response/response-post-auth-register.dto';
import { ResponsePostAuthLoginDto } from './dto/response/response-post-auth-login.dto';
import { ResponsePostAuthRefreshDto } from './dto/response/response-post-auth-refresh.dto';
import { ResponsePutAuthProfileDto } from './dto/response/response-put-auth-profile.dto';
import { ResponseDeleteAuthProfileDto } from './dto/response/response-delete-auth-profile.dto';
import { ResponsePostAuthLogoutDto } from './dto/response/response-post-auth-logout.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiOperation({ summary: '회원가입' })
    @ApiResponse({ status: 201, description: '회원가입 성공', type: ResponsePostAuthRegisterDto })
    @Post('register')
    async register(@Body() body: CreateUserDto) {
        return await this.authService.createUser(body);
    }

    @ApiOperation({ summary: '로그인' })
    @ApiResponse({ status: 200, description: '로그인 성공', type: ResponsePostAuthLoginDto })
    @Post('login')
    async login(@Body() body: CreateLoginDto, @Res() res: Response) {
        return await this.authService.createLogin(body, res);
    }

    @ApiOperation({ summary: '로그아웃' })
    @ApiResponse({ status: 200, description: '로그아웃 되었습니다.', type: ResponsePostAuthLogoutDto })
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Req() req, @Res() res: Response) {
        return await this.authService.createLogout(req.user.id, req, res);
    }


    @ApiOperation({ summary: '토큰 갱신' })
    @ApiResponse({ status: 201, description: '토큰이 갱신 되었습니다.', type: ResponsePostAuthRefreshDto })
    @Post('refresh')
    refresh(@Body() body: CreateRefreshDto, @Res() res: Response) {
        return this.authService.createNewAccessTokenByRefreshToken(body, res);
    }


    @ApiOperation({ summary: '프로필 수정' })
    @ApiResponse({ status: 201, description: '프로필이 수정되었습니다.', type: ResponsePutAuthProfileDto })
    @UseGuards(JwtAuthGuard)
    @Put('profile')
    updateProfile(@Req() req, @Body() body: UpdateProfileDto) {
        return this.authService.updateProfile(req.user.id, body);
    }

    @ApiOperation({ summary: '회원 탈퇴' })
    @ApiResponse({ status: 201, description: '회원 탈퇴가 완료되었습니다.', type: ResponseDeleteAuthProfileDto })
    @UseGuards(JwtAuthGuard)
    @Delete('profile')
    deleteUser(@Req() req, @Body() body: DeleteUserDto) {
        return this.authService.deleteUser(req.user.id, body);
    }
}
