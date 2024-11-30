import { Body, Controller, Post, Put, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateLoginDto } from './dto/create-login.dto';
import { AuthService } from './auth.service';
import { CreateRefreshDto } from './dto/create-refresh.dto';
import { Response } from 'express';

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

    @Put('profile')
    updateProfile() {
        // Implement profile update logic here
    }
}
