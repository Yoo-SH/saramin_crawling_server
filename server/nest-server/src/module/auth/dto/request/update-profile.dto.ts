import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateProfileDto {
    @ApiProperty({ example: '홍길동동이', description: '새로운 이름' })
    @IsOptional()
    @IsString()
    readonly newName: string;

    @ApiProperty({ example: 'test@123', description: '기존 비밀번호' })
    @IsString()
    readonly currentPassword?: string;

    @ApiProperty({ example: 'test@1234', description: '새로운 비밀번호' })
    @IsString()
    readonly newPassword?: string;
}