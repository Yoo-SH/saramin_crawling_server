import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateJobsDto {
    @IsString()
    @IsNotEmpty()
    company: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    @IsUrl({ protocols: ['http', 'https'], require_protocol: true }, { message: "url 형식이 아닙니다." })
    link: string;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsString()
    @IsNotEmpty()
    experience: string;

    @IsString()
    @IsNotEmpty()
    education: string;

    @IsString()
    @IsNotEmpty()
    employment_type: string;

    @IsString()
    @IsNotEmpty()
    deadline: string;

    @IsString()
    @IsNotEmpty()
    sector: string;

    @IsString()
    @IsNotEmpty()
    salary: string;
}