import { Controller, Post, UseGuards, Req, Body, Get, Query, Delete, Param } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from 'src/common/guard/jwt.auth.guard';
import { CreateApplicationsDto } from './dto/request/create-applications.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponsePostApplicationsDto } from './dto/response/response-post-applications.dto';
import { ResponseGetApplicationsDto } from './dto/response/response-get-applications.dto';
import { ResponseDeleteApplicationsDto } from './dto/response/response-delete-applications.dto';
@ApiTags('applications')
@Controller('applications')
export class ApplicationsController {
    constructor(
        private readonly applicationsService: ApplicationsService,
    ) { }

    @ApiOperation({ summary: '지원서 작성' })
    @ApiResponse({ status: 201, description: '지원이 완료되었습니다.', type: ResponsePostApplicationsDto })
    @UseGuards(JwtAuthGuard)
    @Post()
    async createApplication(@Req() req, @Body() body: CreateApplicationsDto) {
        return this.applicationsService.createApplication(req.user.id, body);
    }

    @ApiOperation({ summary: '지원서 조회' })
    @ApiResponse({ status: 200, description: '지원 목록 조회가 완료되었습니다.', type: ResponseGetApplicationsDto })
    @Get()
    async getApplications(
        @Query('user_id') user_id?: number,
        @Query('status') status?: 'applying' | 'approval' | 'rejected',
        @Query('sortByDate') sortByDate?: 'ASC' | 'DESC',
    ) {
        // 간단하게 서비스에 요청을 전달하고 결과를 반환
        return await this.applicationsService.getApplications({ user_id, status, sortByDate });
    }

    @ApiOperation({ summary: '지원서 삭제' })
    @ApiResponse({ status: 200, description: '지원 정보가 삭제되었습니다.', type: ResponseDeleteApplicationsDto })
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteApplication(@Req() req, @Param('id') application_id: number) {
        return await this.applicationsService.deleteApplication(req.user.id, application_id);
    }
}
