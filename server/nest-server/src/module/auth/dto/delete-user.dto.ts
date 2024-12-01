import { IsString, IsNotEmpty } from 'class-validator';
import { Matches } from 'class-validator';

export class DeleteUserDto {
    @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
    @IsNotEmpty({ message: '비밀번호는 필수 항목입니다.' })
    password: string;

    @IsNotEmpty({ message: '"동의합니다"는 필수 항목입니다.' })
    @Matches(/^동의합니다$/, { message: '\'동의합니다\'라는 문구를 입력해주세요.' })
    agreementString: string;
}
