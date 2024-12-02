import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Jobs } from './entity/jobs.entity';
import { GetJobsDto } from './dto/get-jobs.dto';

@Injectable()
export class JobsService {
    constructor(@InjectRepository(Jobs) private readonly repo_jobs: Repository<Jobs>) { }

    async getJobs(getJobsDto: GetJobsDto) {

        try {
            const {
                page = 1,
                location,
                employment_type,
                salary,
                sector,
                sortBy = 'deadline',
                keyword,
                company,
                title,
            } = getJobsDto;

            const pageSize = 20; //페이지 사이즈는 고정


            const query = this.repo_jobs.createQueryBuilder('job');

            // 필터링 조건
            if (keyword) {
                query.andWhere('job.title LIKE :keyword OR job.company LIKE :keyword OR job.location LIKE :keyword OR job.employment_type LIKE :keyword OR job.salary LIKE :keyword OR job.sector LIKE :keyword', { keyword: `%${keyword}%` });
            }
            if (location) query.andWhere('job.location LIKE :location', { location: `%${location}%` });
            if (employment_type) query.andWhere('job.employment_type LIKE :employment_type', { employment_type: `%${employment_type}%` });
            if (salary) query.andWhere('job.salary LIKE :salary', { salary: `%${salary}%` });
            if (sector) query.andWhere('job.sector LIKE :stack', { stack: `%${sector}%` });
            if (company) query.andWhere('job.company LIKE :company', { company: `%${company}%` });
            if (title) query.andWhere('job.title LIKE :title', { title: `%${title}%` });

            // 정렬, 오름차순
            query.orderBy(`job.${sortBy}`, 'ASC');

            // 페이지네이션
            query.skip((page - 1) * pageSize).take(pageSize);

            const [jobs, total] = await query.getManyAndCount();
            if (jobs.length === 0 || total === 0) {
                return { messeges: '데이터가 없습니다.', status: "error", statusCode: 404 };
            }

            return {
                messeges: '성공',
                data: jobs,
                '총 개수': total,
                '페이지 번호': page,
                '페이지 크기': pageSize,
                statusCode: 200
            };

        } catch (error) {
            return { messeges: '실패', data: error, statusCode: 400 };
        }
    }
}
