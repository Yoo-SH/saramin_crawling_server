import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateRefreshDto {

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyOCwiaWF0IjoxNzMzNDY3MDYxLCJleHAiOjE3MzM0Nzc4NjF9.k9Z-fN9Tph8YfwlYfAzTe0gC47J0dcq45XwpdUljtp8', description: '리프레시 토큰' })
    @IsString({ message: '리프레시 토큰은 문자열이어야 합니다.' })
    @IsNotEmpty({ message: '리프레시 토큰은 필수 항목입니다.' })
    readonly refreshToken: string;
}