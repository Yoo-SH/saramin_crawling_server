import { Body, Controller, Post, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() body: CreateUserDto) {
        return await this.authService.createUser(body);
    }

    @Post('login')
    login() {
        // Implement login logic here
    }

    @Post('refresh')
    refresh() {
        // Implement refresh logic here
    }

    @Put('profile')
    updateProfile() {
        // Implement profile update logic here
    }
}
