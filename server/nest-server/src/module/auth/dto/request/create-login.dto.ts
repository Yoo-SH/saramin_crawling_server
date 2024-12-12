import { IsEmail, IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class CreateLoginDto {
    @ApiProperty({ example: 'test@jbnu.ac.kr', description: '이메일' })
    @IsEmail({}, { message: '유효한 이메일 주소를 입력하세요.' })
    @IsNotEmpty({ message: '이메일은 필수 항목입니다.' })
    email: string;

    @ApiProperty({ example: 'test@123', description: '비밀번호' })
    @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
    @IsNotEmpty({ message: '비밀번호는 필수 항목입니다.' })
    password: string;
}