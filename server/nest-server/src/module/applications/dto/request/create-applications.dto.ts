import { IsString, IsNotEmpty, IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationsDto {
    @ApiProperty({ example: '저는 어릴적 부터 이 회사에 지원하는 게 꿈이였습니다.', description: '이력서' })
    @IsString({ message: '이력서는 문자열이어야 합니다.' })
    @IsNotEmpty({ message: '이력서는 필수 입력값입니다.' })
    resume: string;

    @ApiProperty({ description: 'job_id', example: 570, })
    @IsInt({ message: 'job_id는 정수여야 합니다.' })
    @IsPositive({ message: 'job_id는 양수여야 합니다.' })
    @IsNotEmpty({ message: 'job_id는 필수 입력값입니다.' })
    job_id: number;
}
