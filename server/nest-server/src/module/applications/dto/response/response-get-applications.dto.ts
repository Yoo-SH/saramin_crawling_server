import { ApiProperty } from '@nestjs/swagger';
import { JobDto } from '../../../../common/dto/response-object/job.dto';

class DataResponseGetApplicationsDto {
    @ApiProperty({ example: 28 })
    user_id: number;

    @ApiProperty({ type: JobDto })
    job: JobDto;
}

export class ResponseGetApplicationsDto {

    @ApiProperty({ example: 'success' })
    status: string;

    @ApiProperty({ example: '지원 목록 조회가 완료되었습니다.' })
    message: string;

    @ApiProperty({ example: 200 })
    statusCode: number;

    @ApiProperty({ type: DataResponseGetApplicationsDto })
    data: DataResponseGetApplicationsDto

}