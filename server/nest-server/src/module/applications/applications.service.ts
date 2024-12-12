import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Applications } from './entity/applications.entity';
import { CreateApplicationsDto } from './dto/request/create-applications.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class ApplicationsService {
    constructor(
        @InjectRepository(Applications) private readonly repo_applications: Repository<Applications>,
    ) { }

    async createApplication(user_id: number, createApplicationsDto: CreateApplicationsDto) {
        try {
            const { resume, job_id } = createApplicationsDto

            //중복 지원 체크
            const isExist = await this.repo_applications.findOne({
                where: { user: { id: user_id }, job: { id: job_id } },
                relations: ['user', 'job']
            });

            if (isExist) {
                return { message: '이미 지원한 공고입니다.', data: isExist, status: 409, };
            }

            const application = this.repo_applications.create({
                resume,
                user: { id: user_id },
                job: { id: job_id }
            });

            await this.repo_applications.save(application);

            return {
                message: '지원이 완료되었습니다.', data: application, status: 201
            }
        } catch (error) {
            throw new InternalServerErrorException("지원 중 서버에서 오류가 발생했습니다.");
        }

    }


    async getApplications(query: { user_id?: number; status?: 'applying' | 'approval' | 'rejected'; sortByDate?: 'ASC' | 'DESC' }) {
        try {
            const { user_id, status, sortByDate } = query;

            // 간단한 조건부 필터링을 위해 find 메서드 사용
            const findOptions: any = {
                relations: ['user', 'job'],
                where: {},
            };

            // 조건 추가
            if (user_id) {
                findOptions.where.user = { id: user_id };
            }

            if (status) {
                findOptions.where.status = status;
            }

            if (sortByDate) {
                findOptions.order = { createdAt: sortByDate };
            }

            const applications = await this.repo_applications.find(findOptions);

            if (applications.length === 0) {
                throw new NotFoundException('조회된 지원 목록이 없습니다.');
            }

            // 사용자 기준으로 직무 정보를 묶어서 반환
            const userApplications = applications.reduce((acc, app) => {
                if (!acc.user_id) {
                    acc.user_id = app.user.id;
                }
                acc.jobs.push({
                    job_id: app.job.id,
                    title: app.job.title,
                    company: app.job.company,
                    location: app.job.location,
                    experience: app.job.experience,
                    deadline: app.job.deadline,
                });
                return acc;
            }, { user_id: user_id, jobs: [] });

            return {
                message: '지원 목록 조회가 완료되었습니다.',
                data: userApplications,
                status: 200,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.log(error);
            throw new InternalServerErrorException('지원 목록 조회 중 서버에서 오류가 발생했습니다.');
        }
    }

    async deleteApplication(user_id, application_id: number) {
        try {
            const application = await this.repo_applications.findOne({
                where: { id: application_id, user: { id: user_id } },
                relations: ['user', 'job']
            });

            if (!application) {
                throw new NotFoundException('해당 지원 정보가 존재하지 않습니다.');
            }

            await this.repo_applications.remove(application);

            return {
                message: '지원 정보가 삭제되었습니다.',
                data: application,
                status: 200,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.log(error);
            throw new InternalServerErrorException('지원 정보 삭제 중 서버에서 오류가 발생했습니다.');
        }
    }
}