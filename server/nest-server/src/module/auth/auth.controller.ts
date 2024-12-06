import { Body, Controller, Post, Put, Res, UseGuards, Req } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateLoginDto } from './dto/create-login.dto';
import { AuthService } from './auth.service';
import { CreateRefreshDto } from './dto/create-refresh.dto';
import { Response, Request } from 'express';
import { JwtAuthGuard } from 'src/common/guard/jwt.auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @ApiOperation({ summary: '회원가입' })
    @Post('register')
    async register(@Body() body: CreateUserDto) {
        return await this.authService.createUser(body);
    }

    @ApiOperation({ summary: '로그인' })
    @Post('login')
    async login(@Body() body: CreateLoginDto, @Res() res: Response) {
        return await this.authService.createLogin(body, res);
    }

    @ApiOperation({ summary: '로그아웃' })
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Req() req, @Res() res: Response) {
        return await this.authService.createLogout(req.user.id, req, res);
    }


    @ApiOperation({ summary: '토큰 갱신' })
    @Post('refresh')
    refresh(@Body() body: CreateRefreshDto, @Res() res: Response) {
        return this.authService.createNewAccessTokenByRefreshToken(body, res);
    }

    @ApiOperation({ summary: '프로필 수정' })
    @UseGuards(JwtAuthGuard)
    @Put('profile')
    updateProfile(@Req() req, @Body() body: UpdateProfileDto) {
        return this.authService.updateProfile(req.user.id, body);
    }

    @ApiOperation({ summary: '회원 탈퇴' })
    @UseGuards(JwtAuthGuard)
    @Put('delete')
    deleteUser(@Req() req, @Body() body: DeleteUserDto) {
        return this.authService.deleteUser(req.user.id, body);
    }
}
