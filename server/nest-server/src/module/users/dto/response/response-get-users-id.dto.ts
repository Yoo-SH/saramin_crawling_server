import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "src/common/dto/response-object/user.dto";

class DataResponseGetUsersIdDto {
    @ApiProperty({ example: 28 })
    user_id: number;

    @ApiProperty({ example: "유승현" })
    user_name: string;
}

export class ResponseGetUsersIdDto {
    @ApiProperty({ example: "success" })
    status: string;

    @ApiProperty({ example: "사용자 조회 성공" })
    message: string;

    @ApiProperty({ example: 200 })
    statusCode: number;

    @ApiProperty({ example: DataResponseGetUsersIdDto })
    data: DataResponseGetUsersIdDto

}