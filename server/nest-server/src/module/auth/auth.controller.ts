import { Body, Controller, Post, Put, Res, UseGuards, Req } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateLoginDto } from './dto/create-login.dto';
import { AuthService } from './auth.service';
import { CreateRefreshDto } from './dto/create-refresh.dto';
import { Response, Request } from 'express';
import { JwtAuthGuard } from 'src/common/guard/jwt.auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() body: CreateUserDto) {
        return await this.authService.createUser(body);
    }

    @Post('login')
    async login(@Body() body: CreateLoginDto, @Res() res: Response) {
        return await this.authService.createLogin(body, res);
    }

    @Post('refresh')
    refresh(@Body() body: CreateRefreshDto, @Res() res: Response) {
        return this.authService.createNewAccessTokenByRefreshToken(body, res);
    }

    @UseGuards(JwtAuthGuard)
    @Put('profile')
    updateProfile(@Req() Req, @Body() body: UpdateProfileDto) {
        return this.authService.updateProfile(Req.user.id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Put('delete')
    deleteUser(@Req() req, @Body() body: DeleteUserDto) {
        return this.authService.deleteUser(req.user.id, body);
    }
}
