import { ApiProperty } from "@nestjs/swagger";
class DataResponsePostBookmarksDto {
    @ApiProperty({ example: 28 })
    user: number;

    @ApiProperty({ example: 600 })
    job: number;
}

export class ResponsePostBookmarksDto {
    @ApiProperty({ example: "success" })
    status: string;

    @ApiProperty({ example: "북마크가 되었습니다 or 북마크가 해제되었습니다" })
    message: string;

    @ApiProperty({ example: 201 })
    statusCode: number;

    @ApiProperty({ example: DataResponsePostBookmarksDto })
    data: DataResponsePostBookmarksDto;

}