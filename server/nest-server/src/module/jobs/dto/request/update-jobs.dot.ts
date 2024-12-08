import { IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateJobsDto {
    @ApiProperty({ example: '(주)누리보이스', description: '회사명' })
    @IsString()
    @IsOptional()
    company: string;

    @ApiProperty({ example: '2024년 누리보이스 백엔드 개발 /APP 개발(프론트엔드) 경력채용', description: '제목' })
    @IsString()
    @IsOptional()
    title: string;

    @ApiProperty({ example: 'https://www.jobplanet.co.kr/companies/104282/reviews/%EC%9C%A0%EC%9D%B8%EC%9E%90%EC%97%B0%EA%B5%AC%EC%86%8C', description: '링크' })
    @IsString()
    @IsOptional()
    @IsUrl({ protocols: ['http', 'https'], require_protocol: true }, { message: "url 형식이 아닙니다." })
    link: string;

    @ApiProperty({ example: '서울 강남구', description: '지역' })
    @IsString()
    @IsOptional()
    location: string;

    @ApiProperty({ example: '경력, 신입', description: '경력' })
    @IsString()
    @IsOptional()
    experience: string;

    @ApiProperty({ example: '대졸이상', description: '학력' })
    @IsString()
    @IsOptional()
    education: string;

    @ApiProperty({ example: '정규직', description: '고용형태' })
    @IsString()
    @IsOptional()
    employment_type: string;

    @ApiProperty({ example: '상시채용', description: '마감일' })
    @IsString()
    @IsOptional()
    deadline: string;

    @ApiProperty({ example: 'node js', description: '업종' })
    @IsString()
    @IsOptional()
    sector: string;

    @ApiProperty({ example: '성과금', description: '급여' })
    @IsString()
    @IsOptional()
    salary: string;
}