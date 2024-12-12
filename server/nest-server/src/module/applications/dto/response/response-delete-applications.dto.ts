import { ApiProperty } from '@nestjs/swagger';
import { JobDto } from '../../../../common/dto/response-object/job.dto';
import { UserDto } from '../../../../common/dto/response-object/user.dto';
class DataResponseDeleteApplicationsDto {
    @ApiProperty({ example: "저는 어릴적 부터 이 회사에 지원하는 게 꿈이였습니다." })
    resume: string;

    @ApiProperty({ example: "applying" })
    status: string;

    @ApiProperty({ example: "2024-12-04T15:09:17.640Z" })
    created_at: Date;

    @ApiProperty({ example: "2024-12-04T15:09:17.640Z" })
    updated_at: Date;

    @ApiProperty({ type: UserDto })
    user: UserDto;

    @ApiProperty({ type: JobDto })
    job: JobDto;
}

export class ResponseDeleteApplicationsDto {

    @ApiProperty({ example: 'success' })
    status: string;

    @ApiProperty({ example: '지원 정보가 삭제되었습니다.' })
    message: string;

    @ApiProperty({ example: 200 })
    statusCode: number;

    @ApiProperty({ type: DataResponseDeleteApplicationsDto })
    data: DataResponseDeleteApplicationsDto

}