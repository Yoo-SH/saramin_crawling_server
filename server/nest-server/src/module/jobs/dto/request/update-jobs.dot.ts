import { IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateJobsDto {
    @ApiProperty({ example: '(주)씨아이랩스', description: '회사명' })
    @IsString()
    @IsOptional()
    company: string;

    @ApiProperty({ example: '경력직 풀스택 개발자(ReactJS/Nodejs/ 등) 구인공고', description: '제목' })
    @IsString()
    @IsOptional()
    title: string;

    @ApiProperty({ example: 'https://www.saramin.co.kr/zf_user/jobs/relay/view?view_type=search&rec_idx=49371713&location=ts&searchword=node+js&searchType=search&paid_fl=n&search_uuid=61cd8441-b754-4080-b9f0-2821b30aa8b3', description: '링크' })
    @IsString()
    @IsOptional()
    @IsUrl({ protocols: ['http', 'https'], require_protocol: true }, { message: "url 형식이 아닙니다." })
    link: string;

    @ApiProperty({ example: '경기 고양시 일산동구', description: '지역' })
    @IsString()
    @IsOptional()
    location: string;

    @ApiProperty({ example: '경력6년↑', description: '경력' })
    @IsString()
    @IsOptional()
    experience: string;

    @ApiProperty({ example: '학력무관', description: '학력' })
    @IsString()
    @IsOptional()
    education: string;

    @ApiProperty({ example: '정규직', description: '고용형태' })
    @IsString()
    @IsOptional()
    employment_type: string;

    @ApiProperty({ example: '~ 01/10(금)', description: '마감일' })
    @IsString()
    @IsOptional()
    deadline: string;

    @ApiProperty({ example: 'ReactJS, JSP, 앱개발, 웹개발, API', description: '업종' })
    @IsString()
    @IsOptional()
    sector: string;

    @ApiProperty({ example: '성과급/상여금', description: '급여' })
    @IsString()
    @IsOptional()
    salary: string;
}