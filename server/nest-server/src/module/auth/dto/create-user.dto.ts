import { IsString, IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*[0-9]).{8,}$/, {
        message: '비밀번호는 최소 8자 이상이어야 하며, 숫자와 문자를 포함해야 합니다.',
    })
    password: string;

    @IsString()
    @IsNotEmpty()
    username: string;
}    
