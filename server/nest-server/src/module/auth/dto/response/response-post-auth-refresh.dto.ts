import { ApiProperty } from "@nestjs/swagger";

class DataResponsePostAuthRefreshDto {
    @ApiProperty({ example: "운영진" })
    username: string;
}


export class ResponsePostAuthRefreshDto {
    @ApiProperty({ example: "success" })
    status: string;

    @ApiProperty({ example: "토큰이 갱신되었습니다." })
    message: string;

    @ApiProperty({ example: 201 })
    statusCode: number;

    @ApiProperty({ type: DataResponsePostAuthRefreshDto })
    data: DataResponsePostAuthRefreshDto

}
