import { ApiProperty } from '@nestjs/swagger';

class DataResponsePostAuthLoginDto {
    @ApiProperty({ example: "홍길동" })
    username: string;

    @ApiProperty({ example: "test@jbnu.ac.kr" })
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