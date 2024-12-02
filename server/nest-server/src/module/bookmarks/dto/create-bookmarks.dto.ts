import { IsNumber } from 'class-validator';

export class CreateBookmarkDto {
    @IsNumber()
    job_id: number;
}