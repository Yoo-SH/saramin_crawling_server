import { ApiProperty } from '@nestjs/swagger';
import { CompanyDto } from 'src/common/dto/response-object/company.dto';


export class ResponsePostCompanyDto {
    @ApiProperty({ example: 'success' })
    status: string;

    @ApiProperty({ example: '회사가 생성되었습니다.' })
    messesage: string;

    @ApiProperty({ example: 201 })
    statusCode: number;

    @ApiProperty({ type: CompanyDto })
    data: CompanyDto;
}