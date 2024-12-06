import { ApiProperty } from '@nestjs/swagger';

class DataResponsePostAuthRegisterDto {
    @ApiProperty({ example: "운영진" })
    username: string;

    @ApiProperty({ example: "asd137486@jbnu.ac.kr" })
    email: string
}

export class ResponsePostAuthRegisterDto {

    @ApiProperty({ example: 'success' })
    status: string;

    @ApiProperty({ example: '회원가입을 성공하였습니다.' })
    message: string;

    @ApiProperty({ example: 201 })
    statusCode: number;

    @ApiProperty({ type: DataResponsePostAuthRegisterDto })
    data: DataResponsePostAuthRegisterDto

}