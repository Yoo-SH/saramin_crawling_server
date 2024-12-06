import { IsString, IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateJobsDto {
    @ApiProperty({ example: '(주)누리보이스', description: '회사명' })
    @IsString()
    @IsNotEmpty()
    company: string;

    @ApiProperty({ example: '2024년 누리보이스 백엔드 개발 /APP 개발(프론트엔드) 경력채용', description: '제목' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'https://www.jobplanet.co.kr/companies/104282/reviews/%EC%9C%A0%EC%9D%B8%EC%9E%90%EC%97%B0%EA%B5%AC%EC%86%8C', description: '링크' })
    @IsString()
    @IsNotEmpty()
    @IsUrl({ protocols: ['http', 'https'], require_protocol: true }, { message: "url 형식이 아닙니다." })
    link: string;

    @ApiProperty({ example: '서울 강남구', description: '지역' })
    @IsString()
    @IsNotEmpty()
    location: string;

    @ApiProperty({ example: '경력, 신입', description: '경력' })
    @IsString()
    @IsNotEmpty()
    experience: string;

    @ApiProperty({ example: '대졸이상', description: '학력' })
    @IsString()
    @IsNotEmpty()
    education: string;

    @ApiProperty({ example: '정규직', description: '고용형태' })
    @IsString()
    @IsNotEmpty()
    employment_type: string;

    @ApiProperty({ example: '상시채용', description: '마감일' })
    @IsString()
    @IsNotEmpty()
    deadline: string;

    @ApiProperty({ example: 'node js', description: '업종' })
    @IsString()
    @IsNotEmpty()
    sector: string;

    @ApiProperty({ example: '성과금', description: '급여' })
    @IsString()
    @IsNotEmpty()
    salary: string;
}