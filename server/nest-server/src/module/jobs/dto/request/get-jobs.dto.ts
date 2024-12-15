import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetJobsDto {
    @ApiProperty({ example: 1, description: '페이지 번호', required: false })
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10),)
    @IsNumber({}, { message: "page는는 숫자여야 합니다." })
    @Min(1, { message: "page는 1 이상이어야 합니다." })
    page?: number;

    @ApiProperty({ example: '경기 고양시', description: '지역', required: false })
    @IsOptional()
    @IsString({ message: "location는 문자열이어야 합니다." })
    location?: string;

    @ApiProperty({ example: '학력무관', description: '고용형태', required: false })
    @IsOptional()
    @IsString({ message: "employment_type는 문자열이어야 합니다." })
    employment_type?: string;

    @ApiProperty({ example: '성과금', description: '급여', required: false })
    @IsOptional()
    @IsString({ message: "salary는 문자열이어야 합니다." })
    salary?: string;

    @ApiProperty({ example: 'node js', description: '업종', required: false })
    @IsOptional()
    @IsString({ message: "sector은 문자열이어야 합니다." })
    sector?: string;

    @ApiProperty({ example: 'asc', description: '정렬 기준(오름차순: asc, 내림차순: desc)', required: false })
    @IsOptional()
    @IsString({ message: "sortBy은 문자열이어야 합니다." })
    sortBy?: string;

    @ApiProperty({ example: 'ReactJS', description: '키워드', required: false })
    @IsOptional()
    @IsString({ message: "keyword는 문자열이어야 합니다." })
    keyword?: string;

    @ApiProperty({ example: '씨아이랩스', description: '회사', required: false })
    @IsOptional()
    @IsString({ message: "company는 문자열이어야 합니다." })
    company?: string;

    @ApiProperty({ example: '경력직 풀스택 개발자(ReactJS/Nodejs/ 등) 구인공고', description: '제목', required: false })
    @IsOptional()
    @IsString({ message: "title은 문자열이어야 합니다." })
    title?: string;
}
