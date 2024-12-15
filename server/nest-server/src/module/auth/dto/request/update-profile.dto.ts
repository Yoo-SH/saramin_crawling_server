import { IsString, IsOptional, Matches, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateProfileDto {
    @ApiProperty({ example: '홍길동동이', description: '새로운 이름' })
    @IsNotEmpty({ message: '새로운 사용자 이름은 필수 항목입니다.' })
    @IsString({ message: '새로운 사용자 이름은 문자열이어야 합니다.' })
    readonly newName: string;

    @ApiProperty({ example: 'test@123', description: '기존 비밀번호' })
    @IsString({ message: '기존 비밀번호는 문자열이어야 합니다.' })
    readonly currentPassword?: string;

    @ApiProperty({ example: 'test@1234', description: '새로운 비밀번호' })
    @Matches(/^(?=.*[a-z])(?=.*[0-9]).{8,}$/, {
        message: '새로운 비밀번호는 최소 8자 이상이어야 하며, 숫자와 문자를 포함해야 합니다.',
    })
    @IsString({ message: '새로운 비밀번호는 문자열이어야 합니다.' })
    readonly newPassword?: string;
}