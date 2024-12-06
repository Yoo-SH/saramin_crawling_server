import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookmarkDto {
    @ApiProperty({ description: 'job_id', example: 1, })
    @IsNumber()
    job_id: number;
}