import { IsEmail, IsString, IsNotEmpty } from "class-validator";
export class CreateLoginDto {
    @IsEmail({}, { message: '유효한 이메일 주소를 입력하세요.' })
    @IsNotEmpty({ message: '이메일은 필수 항목입니다.' })
    email: string;

    @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
    @IsNotEmpty({ message: '비밀번호는 필수 항목입니다.' })
    password: string;
}