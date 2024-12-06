import { ApiProperty } from '@nestjs/swagger';

export class ResponsePostAuthLogoutDto {
    @ApiProperty({ example: "success" })
    status: string;

    @ApiProperty({ example: "로그아웃 되었습니다." })
    message: string;

    @ApiProperty({ example: 200 })
    statusCode: number;
}