import { Controller, Get, Param, Post, Query, Body, Put, Delete } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { GetJobsDto } from './dto/request/get-jobs.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guard/jwt.auth.guard';
import { CreateJobsDto } from './dto/request/create-jobs.dto';
import { UpdateJobsDto } from './dto/request/update-jobs.dot';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseGetJobsDto } from './dto/response/response-get-jobs.dto';
import { ResponseGetJobsIdDto } from './dto/response/response-get-jobs-id.dto';
import { ResponsePostJobsDto } from './dto/response/response-post-jobs.dto';
import { ResponsePutJobsIdDto } from './dto/response/response-put-jobs-id.dto';
import { ResponseDeleteJobsIdDto } from './dto/response/response-delete-jobs-id.dto';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) { }

    @ApiOperation({ summary: '모든 채용공고 조회' })
    @ApiResponse({ status: 200, description: '성공', type: ResponseGetJobsDto })
    @Get()
    async getJobs(@Query() getJobsDto: GetJobsDto) {
        return await this.jobsService.getJobs(getJobsDto);
    }

    @ApiOperation({ summary: '특정 채용공고 조회' })
    @ApiResponse({ status: 200, description: '성공', type: ResponseGetJobsIdDto })
    @Get(':id')
    async getJob(@Param('id') id: number) {
        return await this.jobsService.getJob(id);
    }

    @ApiOperation({ summary: '채용공고 생성' })
    @ApiResponse({ status: 201, description: '성공(data는 body와 동일)', type: ResponsePostJobsDto })
    @UseGuards(JwtAuthGuard)
    @Post()
    async createJob(@Body() createJobsDto: CreateJobsDto) {
        return await this.jobsService.createJob(createJobsDto);
    }

    @ApiOperation({ summary: '채용공고 수정' })
    @ApiResponse({ status: 201, description: '성공(data는 body와 동일)', type: ResponsePutJobsIdDto })
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateJob(@Param('id') id: number, @Body() UpdateJobsDto: UpdateJobsDto) {
        return await this.jobsService.updateJob(id, UpdateJobsDto);
    }

    @ApiOperation({ summary: '채용공고 삭제' })
    @ApiResponse({ status: 201, description: '성공(data는 body와 동일)', type: ResponseDeleteJobsIdDto })
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteJob(@Param('id') id: number) {
        return await this.jobsService.deleteJob(id);
    }

}
