import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetJobsDto {
    @ApiProperty({ example: 1, description: '페이지 번호' })
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10),)
    @IsNumber({}, { message: "페이지는 숫자여야 합니다." })
    @Min(1, { message: "페이지는 1 이상이어야 합니다." })
    page?: number;

    @ApiProperty({ example: '서울 강남구', description: '지역' })
    @IsOptional()
    @IsString({ message: "위치는 문자열이어야 합니다." })
    location?: string;

    @ApiProperty({ example: '정규직', description: '고용형태' })
    @IsOptional()
    @IsString({ message: "고용형태는 문자열이어야 합니다." })
    employment_type?: string;

    @ApiProperty({ example: '성과금', description: '급여' })
    @IsOptional()
    @IsString({ message: "급여는 문자열이어야 합니다." })
    salary?: string;

    @ApiProperty({ example: 'node js', description: '업종' })
    @IsOptional()
    @IsString({ message: "업종은 문자열이어야 합니다." })
    sector?: string;

    @ApiProperty({ example: 'asc', description: '정렬 기준(오름차순: asc, 내림차순: desc)' })
    @IsOptional()
    @IsString({ message: "정렬 기준은 문자열이어야 합니다." })
    sortBy?: string;

    @ApiProperty({ example: 'node js', description: '키워드' })
    @IsOptional()
    @IsString({ message: "키워드는 문자열이어야 합니다." })
    keyword?: string;

    @ApiProperty({ example: '(주)누리보이스', description: '회사' })
    @IsOptional()
    @IsString({ message: "회사는 문자열이어야 합니다." })
    company?: string;

    @ApiProperty({ example: '2024년 누리보이스 백엔드 개발 /APP 개발(프론트엔드) 경력채용', description: '제목' })
    @IsOptional()
    @IsString({ message: "제목은 문자열이어야 합니다." })
    title?: string;
}
