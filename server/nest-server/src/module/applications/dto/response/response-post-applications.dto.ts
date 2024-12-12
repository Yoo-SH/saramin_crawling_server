import { ApiProperty } from '@nestjs/swagger';
import { JobDto } from '../../../../common/dto/response-object/job.dto';
import { UserDto } from '../../../../common/dto/response-object/user.dto';

class DataResponsePostApplicationsDto {
    @ApiProperty({ type: UserDto })
    user: UserDto;

    @ApiProperty({ type: JobDto })
    job: JobDto;
}

export class ResponsePostApplicationsDto {
    @ApiProperty({ example: 'success' })
    status: string;

    @ApiProperty({ example: '지원이 완료되었습니다.' })
    message: string;

    @ApiProperty({ example: 201 })
    statusCode: number;

    @ApiProperty({ type: DataResponsePostApplicationsDto })
    data: DataResponsePostApplicationsDto;
}