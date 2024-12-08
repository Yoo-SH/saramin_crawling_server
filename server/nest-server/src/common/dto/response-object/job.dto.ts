import { ApiProperty } from '@nestjs/swagger';
// 공고 정보 DTO
export class JobDto {
    @ApiProperty({ example: 570 })
    id: number;

    @ApiProperty({ example: '씨아이랩스' })
    company: string;

    @ApiProperty({ example: '경력직 풀스택 개발자(ReactJS/Nodejs/ 등) 구인공고' })
    title: string;

    @ApiProperty({
        example:
            'https://www.saramin.co.kr/zf_user/jobs/relay/view?view_type=search&rec_idx=49371713&location=ts&searchword=node+js&searchType=search&paid_fl=n&search_uuid=61cd8441-b754-4080-b9f0-2821b30aa8b3',
    })
    link: string;

    @ApiProperty({ example: '경기 고양시 일산동구' })
    location: string;

    @ApiProperty({ example: '경력6년↑' })
    experience: string;

    @ApiProperty({ example: '학력무관' })
    education: string;

    @ApiProperty({ example: '정규직' })
    employment_type: string;

    @ApiProperty({ example: '~ 01/10(금)' })
    deadline: string;

    @ApiProperty({
        example: 'ReactJS, JSP, 앱개발, 웹개발, API 외                    등록일 24/11/11',
    })
    sector: string;

    @ApiProperty({ example: '성과급/상여금' })
    salary: string;

    @ApiProperty({ example: 0 })
    viewCount: number;
}