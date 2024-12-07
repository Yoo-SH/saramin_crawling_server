import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
    @ApiProperty({ example: 'error' })
    status: string;

    @ApiProperty({})
    message: string;

    @ApiProperty({})
    statusCode: number;
}
