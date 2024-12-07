import { Controller, Get, Param, Post, Query, Body, Put, Delete } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { GetJobsDto } from './dto/request/get-jobs.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guard/jwt.auth.guard';
import { CreateJobsDto } from './dto/request/create-jobs.dto';
import { UpdateJobsDto } from './dto/request/update-jobs.dot';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { ResponseGetJobsDto } from './dto/response/response-get-jobs.dto';
import { ResponseGetJobsIdDto } from './dto/response/response-get-jobs-id.dto';
import { ResponsePostJobsDto } from './dto/response/response-post-jobs.dto';
import { ResponsePutJobsIdDto } from './dto/response/response-put-jobs-id.dto';
import { ResponseDeleteJobsIdDto } from './dto/response/response-delete-jobs-id.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) { }

    @ApiOperation({ summary: '모든 채용공고 조회' })
    @ApiResponse({ status: 200, description: '성공', type: ResponseGetJobsDto })
    @ApiResponse({ status: 400, description: '실패', type: ErrorResponseDto })
    @Get()
    async getJobs(@Query() getJobsDto: GetJobsDto) {
        return await this.jobsService.getJobs(getJobsDto);
    }

    @ApiOperation({ summary: '특정 채용공고 조회' })
    @ApiResponse({ status: 200, description: '성공', type: ResponseGetJobsIdDto })
    @ApiResponse({ status: 404, description: '해당 공고가 없습니다.', type: ErrorResponseDto })
    @ApiResponse({ status: 500, description: '공고 상세 조회 중 서버에서 에러가 발생했습니다.', type: ErrorResponseDto })
    @Get(':id')
    async getJob(@Param('id') id: number) {
        return await this.jobsService.getJob(id);
    }

    @ApiOperation({ summary: '채용공고 생성' })
    @ApiResponse({ status: 201, description: '성공(data는 body와 동일)', type: ResponsePostJobsDto })
    @ApiResponse({ status: 500, description: '공고 등록 중 서버에서 에러가 발생했습니다.', type: ErrorResponseDto })
    @ApiSecurity('cookieAuth')
    @UseGuards(JwtAuthGuard)
    @Post()
    async createJob(@Body() createJobsDto: CreateJobsDto) {
        return await this.jobsService.createJob(createJobsDto);
    }

    @ApiOperation({ summary: '채용공고 수정' })
    @ApiResponse({ status: 201, description: '성공(data는 body와 동일)', type: ResponsePutJobsIdDto })
    @ApiResponse({ status: 404, description: '해당 공고가 없습니다.', type: ErrorResponseDto })
    @ApiResponse({ status: 500, description: '공고 수정 중 서버에서 에러가 발생했습니다.', type: ErrorResponseDto })
    @ApiSecurity('cookieAuth')
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateJob(@Param('id') id: number, @Body() UpdateJobsDto: UpdateJobsDto) {
        return await this.jobsService.updateJob(id, UpdateJobsDto);
    }

    @ApiOperation({ summary: '채용공고 삭제' })
    @ApiResponse({ status: 201, description: '성공(data는 body와 동일)', type: ResponseDeleteJobsIdDto })
    @ApiResponse({ status: 404, description: '해당 공고가 없습니다.', type: ErrorResponseDto })
    @ApiResponse({ status: 500, description: '공고 삭제 중 서버에서 에러가 발생했습니다.', type: ErrorResponseDto })
    @ApiSecurity('cookieAuth')
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteJob(@Param('id') id: number) {
        return await this.jobsService.deleteJob(id);
    }

}
