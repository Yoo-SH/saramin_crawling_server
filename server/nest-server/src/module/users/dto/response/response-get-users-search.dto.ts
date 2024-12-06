import { ApiProperty } from "@nestjs/swagger";

class DataResponseGetUsersSearchDto {
    @ApiProperty({ example: 3 })
    user_id: number;

    @ApiProperty({ example: "유승현" })
    user_name: string;
}

export class ResponseGetUsersSearchDto {
    @ApiProperty({ example: "success" })
    status: string;

    @ApiProperty({ example: "사용자 조회 성공" })
    message: string;

    @ApiProperty({ example: 200 })
    statusCode: number;

    @ApiProperty({ example: DataResponseGetUsersSearchDto })
    data: DataResponseGetUsersSearchDto

}