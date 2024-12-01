import { IsString, IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDto {

    @IsEmail({}, { message: '유효한 이메일 주소를 입력하세요.' })
    @IsNotEmpty({ message: '이메일은 필수 항목입니다.' })
    email: string;

    @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
    @IsNotEmpty({ message: '비밀번호는 필수 항목입니다.' })
    @Matches(/^(?=.*[a-z])(?=.*[0-9]).{8,}$/, {
        message: '비밀번호는 최소 8자 이상이어야 하며, 숫자와 문자를 포함해야 합니다.',
    })
    password: string;

    @IsString({ message: '사용자 이름은 문자열이어야 합니다.' })
    @IsNotEmpty({ message: '사용자 이름은 필수 항목입니다.' })
    user_name: string;
}
