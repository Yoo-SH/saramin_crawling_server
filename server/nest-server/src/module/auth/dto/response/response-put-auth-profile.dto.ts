import { ApiProperty } from '@nestjs/swagger';

class DataResponsePutAuthProfileDto {
    @ApiProperty({ example: '홍길동동이' })
    username: string;
}

export class ResponsePutAuthProfileDto {
    @ApiProperty({ example: 'success' })
    status: string;

    @ApiProperty({ example: '프로필이 수정되었습니다.' })
    message: string;

    @ApiProperty({ example: 201 })
    statusCode: number;

    @ApiProperty({ type: DataResponsePutAuthProfileDto })
    data: DataResponsePutAuthProfileDto
}