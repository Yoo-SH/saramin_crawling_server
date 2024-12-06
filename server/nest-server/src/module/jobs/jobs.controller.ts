import { Controller, Get, Param, Post, Query, Body, Put, Delete } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { GetJobsDto } from './dto/get-jobs.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guard/jwt.auth.guard';
import { CreateJobsDto } from './dto/create-jobs.dto';
import { UpdateJobsDto } from './dto/update-jobs.dot';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
    constructor(private readonly jobsService: JobsService) { }

    @ApiOperation({ summary: '모든 채용공고 조회' })
    @Get()
    async getJobs(@Query() getJobsDto: GetJobsDto) {
        return await this.jobsService.getJobs(getJobsDto);
    }

    @ApiOperation({ summary: '특정 채용공고 조회' })
    @Get(':id')
    async getJob(@Param('id') id: number) {
        return await this.jobsService.getJob(id);
    }

    @ApiOperation({ summary: '채용공고 생성' })
    @UseGuards(JwtAuthGuard)
    @Post()
    async createJob(@Body() createJobsDto: CreateJobsDto) {
        return await this.jobsService.createJob(createJobsDto);
    }

    @ApiOperation({ summary: '채용공고 수정' })
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateJob(@Param('id') id: number, @Body() UpdateJobsDto: UpdateJobsDto) {
        return await this.jobsService.updateJob(id, UpdateJobsDto);
    }

    @ApiOperation({ summary: '채용공고 삭제' })
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteJob(@Param('id') id: number) {
        return await this.jobsService.deleteJob(id);
    }

}
