import { ApiProperty } from '@nestjs/swagger';

export class ResponseDeleteAuthProfileDto {
    @ApiProperty({ example: "success" })
    status: string;

    @ApiProperty({ example: "회원 탈퇴가 완료되었습니다." })
    message: string;

    @ApiProperty({ example: 200 })
    statusCode: number;
}