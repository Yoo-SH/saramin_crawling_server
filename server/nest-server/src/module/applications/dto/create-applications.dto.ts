import { IsString, IsNotEmpty, IsInt, IsPositive } from 'class-validator';

export class CreateApplicationsDto {
    @IsString()
    @IsNotEmpty({ message: '이력서는 필수 입력값입니다.' })
    resume: string;

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    job_id: number;
}
