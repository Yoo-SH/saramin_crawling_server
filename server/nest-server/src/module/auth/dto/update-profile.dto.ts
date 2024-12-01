import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    readonly newName: string;

    @IsString()
    readonly currentPassword?: string;

    @IsString()
    readonly newPassword?: string;
}