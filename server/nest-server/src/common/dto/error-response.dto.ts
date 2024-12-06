import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
    @ApiProperty({ example: 'error' })
    status: string;

    @ApiProperty({ example: '유효하지 않은 데이터 입니다.' })
    message: string;

    @ApiProperty({ example: 400 })
    statusCode: number;
}
