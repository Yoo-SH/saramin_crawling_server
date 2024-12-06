import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "src/common/dto/response-object/user.dto";


export class ResponseGetUsersAllDto {
    @ApiProperty({ example: "success" })
    status: string;

    @ApiProperty({ example: "사용자 조회 성공" })
    message: string;

    @ApiProperty({ example: 200 })
    statusCode: number;

    @ApiProperty({ example: UserDto })
    data: UserDto

}