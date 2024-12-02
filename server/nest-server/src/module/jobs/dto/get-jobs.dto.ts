import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class GetJobsDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10),)
    @IsNumber({}, { message: "페이지는 숫자여야 합니다." })
    @Min(1, { message: "페이지는 1 이상이어야 합니다." })
    page?: number;

    @IsOptional()
    @IsString({ message: "위치는 문자열이어야 합니다." })
    location?: string;

    @IsOptional()
    @IsString({ message: "경력은 문자열이어야 합니다." })
    employment_type?: string;

    @IsOptional()
    @IsString({ message: "연봉은 문자열이어야 합니다." })
    salary?: string;

    @IsOptional()
    @IsString({ message: "분야 은 문자열이어야 합니다." })
    sector?: string;

    @IsOptional()
    @IsString({ message: "정렬 기준은 문자열이어야 합니다." })
    sortBy?: string;

    @IsOptional()
    @IsString({ message: "키워드는 문자열이어야 합니다." })
    keyword?: string;

    @IsOptional()
    @IsString({ message: "회사는 문자열이어야 합니다." })
    company?: string;

    @IsOptional()
    @IsString({ message: "제목은 문자열이어야 합니다." })
    title?: string;
}
