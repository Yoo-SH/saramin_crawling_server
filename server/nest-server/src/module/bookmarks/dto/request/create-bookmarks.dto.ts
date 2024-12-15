import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookmarkDto {
    @ApiProperty({ description: 'job_id', example: 570, })
    @IsNumber({}, { message: 'job_id가 숫자가 아닙니다.' })
    job_id: number;
}