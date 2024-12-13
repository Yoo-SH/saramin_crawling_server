import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Jobs } from './entity/jobs.entity';
import { GetJobsDto } from './dto/request/get-jobs.dto';
import { NotFoundException } from '@nestjs/common';
import { CreateJobsDto } from './dto/request/create-jobs.dto';

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

            const pageSize = 20; // 페이지 사이즈는 고정
            const query = this.repo_jobs.createQueryBuilder('job');

            // 필터링 조건
            if (keyword) {
                query.andWhere(
                    'job.title LIKE :keyword OR job.company LIKE :keyword OR job.location LIKE :keyword OR job.employment_type LIKE :keyword OR job.salary LIKE :keyword OR job.sector LIKE :keyword',
                    { keyword: `%${keyword}%` },
                );
            }
            if (location) query.andWhere('job.location LIKE :location', { location: `%${location}%` });
            if (employment_type) query.andWhere('job.employment_type LIKE :employment_type', { employment_type: `%${employment_type}%` });
            if (salary) query.andWhere('job.salary LIKE :salary', { salary: `%${salary}%` });
            if (sector) query.andWhere('job.sector LIKE :sector', { sector: `%${sector}%` });
            if (company) query.andWhere('job.company LIKE :company', { company: `%${company}%` });
            if (title) query.andWhere('job.title LIKE :title', { title: `%${title}%` });

            // 정렬 열 및 방식 검증
            const allowedSortColumns = ['deadline', 'viewCount', 'salary'];
            const sortColumn = allowedSortColumns.includes(sortBy) ? sortBy : 'deadline';
            const order = 'ASC'; // 정렬 방식은 현재 고정(필요시 수정 가능)

            query.orderBy(`job.${sortColumn}`, order);

            // 페이지네이션
            query.skip((page - 1) * pageSize).take(pageSize);

            const [jobs, total] = await query.getManyAndCount();
            if (jobs.length === 0 || total === 0) {
                return { messages: '데이터가 없습니다.', status: "error", statusCode: 404 };
            }

            return {
                messages: '성공',
                data: jobs,
                '총 개수': total,
                '페이지 번호': page,
                '페이지 크기': pageSize,
                statusCode: 200,
            };

        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('공고 조회 중 서버에서 에러가 발생했습니다.');
        }
    }

    async getJob(job_id: number) {
        try {
            // 상세 정보 제공
            const job = await this.repo_jobs.findOne({ where: { id: job_id } });
            if (!job) {
                throw new NotFoundException('해당 공고가 없습니다.');
            }

            //조회수 증가
            job.viewCount += 1;
            await this.repo_jobs.save(job);

            //관련 공고 추천(company, 같은 회사의 다른 공고)
            const relatedJobs = await this.repo_jobs.createQueryBuilder('job')
                .where('job.company LIKE :company', { company: `%${job.company}%` })
                .andWhere('job.id != :id', { id: job_id }) // 현재 job_id는 제외
                .take(5)
                .getMany();


            return { messeges: '성공', data: { job, relatedJobs }, statusCode: 200 };

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('공고 상세 조회 중 서버에서 에러가 발생했습니다.');
        }
    }

    async createJob(createJobsDto: CreateJobsDto) {
        const {
            company,
            title,
            link,
            location,
            experience,
            education,
            employment_type,
            deadline,
            sector,
            salary

        } = createJobsDto;

        try {
            const job = new Jobs();
            job.company = company;
            job.title = title;
            job.link = link;
            job.location = location;
            job.experience = experience;
            job.education = education;
            job.employment_type = employment_type;
            job.deadline = deadline;
            job.sector = sector;
            job.salary = salary;

            await this.repo_jobs.save(job);

            return { messeges: '성공', data: job, statusCode: 201 };
        } catch (error) {
            return new InternalServerErrorException('공고 등록 중 서버에서 에러가 발생했습니다.');
        }
    }

    async updateJob(job_id: number, updateJobsDto: any) {
        try {
            const job = await this.repo_jobs.findOne({ where: { id: job_id } });
            if (!job) {
                throw new NotFoundException('해당 공고가 없습니다.');
            }

            await this.repo_jobs.update(job_id, updateJobsDto);

            return { messeges: '성공', data: job, statusCode: 200 };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('공고 수정 중 서버에서 에러가 발생했습니다.');
        }
    }

    async deleteJob(job_id: number) {
        try {
            const job = await this.repo_jobs.findOne({ where: { id: job_id } });
            if (!job) {
                throw new NotFoundException('해당 공고가 없습니다.');
            }

            await this.repo_jobs.delete(job_id);

            return { messeges: '성공', data: job, statusCode: 200 };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('공고 삭제 중 서버에서 에러가 발생했습니다.');
        }
    }

}
