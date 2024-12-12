import { ApiProperty } from '@nestjs/swagger';
import { link } from 'fs';
import { JobDto } from 'src/common/dto/response-object/job.dto';

export class DataResponseGetJobsDto {
    @ApiProperty({ example: JobDto, examples: [] })
    job: JobDto


    @ApiProperty({
        example: [
            { id: "", company: "", title: '', link: '', location: '', experience: "", education: "", employment_type: "", deadline: "", sector: "", viewCount: "", salary: '' },
            { id: "", company: "", title: '', link: '', location: '', experience: "", education: "", employment_type: "", deadline: "", sector: "", viewCount: "", salary: '' }
        ]
    })
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