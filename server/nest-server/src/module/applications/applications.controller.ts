import { Controller, Post, UseGuards, Req, Body, Get, Query, Delete, Param } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from 'src/common/guard/jwt.auth.guard';
import { CreateApplicationsDto } from './dto/create-applications.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('applications')
@Controller('applications')
export class ApplicationsController {
    constructor(
        private readonly applicationsService: ApplicationsService,
    ) { }

    @ApiOperation({ summary: '지원서 작성' })
    @UseGuards(JwtAuthGuard)
    @Post()
    async createApplication(@Req() req, @Body() body: CreateApplicationsDto) {
        return this.applicationsService.createApplication(req.user.id, body);
    }

    @ApiOperation({ summary: '지원서 조회' })
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
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteApplication(@Req() req, @Param('id') application_id: number) {
        return await this.applicationsService.deleteApplication(req.user.id, application_id);
    }
}
