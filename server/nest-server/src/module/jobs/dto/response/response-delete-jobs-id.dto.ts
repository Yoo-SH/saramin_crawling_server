import { ApiProperty } from '@nestjs/swagger';
import { JobDto } from 'src/common/dto/response-object/job.dto';

class DataResponseDeleteJobsIdDto {
    @ApiProperty({ example: JobDto })
    job: JobDto

}

export class ResponseDeleteJobsIdDto {
    @ApiProperty({ example: "success" })
    status: string

    @ApiProperty({ example: "성공" })
    message: string

    @ApiProperty({ example: 201 })
    statusCode: number

    @ApiProperty({ example: DataResponseDeleteJobsIdDto })
    data: DataResponseDeleteJobsIdDto

}   