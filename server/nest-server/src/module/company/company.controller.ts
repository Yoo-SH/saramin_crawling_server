import { Controller, Body, Post } from '@nestjs/common';
import { CreateCompanyDto } from './dto/request/create-company.dto';
import { CompanyService } from './company.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { ResponsePostCompanyDto } from './dto/response/response-post-company.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

@ApiTags('company')
@Controller('company')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) { }

    @Post()
    @ApiResponse({ status: 201, description: '회사 생성 성공', type: ResponsePostCompanyDto })
    @ApiResponse({ status: 400, description: '회사 ID는 숫자여야 합니다.', type: ErrorResponseDto })
    @ApiResponse({ status: 400, description: '회사 ID는 필수 입력 값입니다.', type: ErrorResponseDto })
    @ApiResponse({ status: 400, description: '회사명은 문자열이어야 합니다.', type: ErrorResponseDto })
    @ApiResponse({ status: 400, description: '회사명은 필수 입력 값입니다.', type: ErrorResponseDto })
    @ApiResponse({ status: 409, description: '이미 존재하는 회사 이름입니다.', type: ErrorResponseDto })
    @ApiResponse({ status: 500, description: '회사 생성과정 중 서버에서 에러가 발생했습니다.', type: ErrorResponseDto })
    async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
        return this.companyService.createCompany(createCompanyDto);
    }
}
