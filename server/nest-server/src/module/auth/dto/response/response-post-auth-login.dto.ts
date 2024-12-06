import { ApiProperty } from '@nestjs/swagger';

class DataResponsePostAuthLoginDto {
    @ApiProperty({ example: "운영진" })
    username: string;

    @ApiProperty({ example: "asd137486@jbnu.ac.kr" })
    email: string
}

export class ResponsePostAuthLoginDto {

    @ApiProperty({ example: 'success' })
    status: string;

    @ApiProperty({ example: '로그인에 성공하였습니다.' })
    message: string;

    @ApiProperty({ example: 200 })
    statusCode: number;

    @ApiProperty({ type: DataResponsePostAuthLoginDto })
    data: DataResponsePostAuthLoginDto

}