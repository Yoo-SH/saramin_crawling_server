import { IsString, IsOptional, IsUrl } from 'class-validator';

export class UpdateJobsDto {
    @IsString()
    @IsOptional()
    company: string;

    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    @IsUrl({ protocols: ['http', 'https'], require_protocol: true }, { message: "url 형식이 아닙니다." })
    link: string;

    @IsString()
    @IsOptional()
    location: string;

    @IsString()
    @IsOptional()
    experience: string;

    @IsString()
    @IsOptional()
    education: string;

    @IsString()
    @IsOptional()
    employment_type: string;

    @IsString()
    @IsOptional()
    deadline: string;

    @IsString()
    @IsOptional()
    sector: string;

    @IsString()
    @IsOptional()
    salary: string;
}