import { IsString } from 'class-validator';

export class CreateRefreshDto {
    @IsString({ message: '리프레시 토큰은 문자열이어야 합니다.' })
    readonly refreshToken: string;
}