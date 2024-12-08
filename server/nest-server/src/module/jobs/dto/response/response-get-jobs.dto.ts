import { ApiProperty } from '@nestjs/swagger';
import { JobDto } from 'src/common/dto/response-object/job.dto';

export class DataResponseGetJobsDto {
    @ApiProperty({ example: JobDto })
    job: JobDto

    @ApiProperty({ example: [JobDto] })
    relatedJobs: JobDto[]

}

export class ResponseGetJobsDto {
    @ApiProperty({ example: "success" })
    status: string

    @ApiProperty({ example: "성공" })
    message: string

    @ApiProperty({ example: 200 })
    statusCode: number

    @ApiProperty({ example: DataResponseGetJobsDto })
    data: DataResponseGetJobsDto
}