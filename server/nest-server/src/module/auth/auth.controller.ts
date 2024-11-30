import { Body, Controller, Post, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateLoginDto } from './dto/create-login.dto';
import { AuthService } from './auth.service';
import { CreateRefreshDto } from './dto/create-refresh.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() body: CreateUserDto) {
        return await this.authService.createUser(body);
    }

    @Post('login')
    login(@Body() body: CreateLoginDto) {
        return this.authService.createLogin(body);

    }

    @Post('refresh')
    refresh(@Body() body: CreateRefreshDto) {
        return this.authService.createNewAccessTokenByRefreshToken(body);
    }

    @Put('profile')
    updateProfile() {
        // Implement profile update logic here
    }
}
