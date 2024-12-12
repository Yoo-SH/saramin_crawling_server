import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entity/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import internal from 'stream';

@Injectable()
export class CompanyService {
    constructor(@InjectRepository(Company) private readonly repo_company: Repository<Company>) { }

    async createCompany(createCompanyDto: CreateCompanyDto) {
        const { company_id, name } = createCompanyDto;
        try {
            const company = this.repo_company.create({ id: company_id, name });
            const existingCompany = await this.repo_company.findOne({ where: { name } });
            if (existingCompany) {
                throw new ConflictException("이미 존재하는 회사 이름입니다.");
            }

            await this.repo_company.save(company);
            return { status: "success", messesage: "회사가 생성되었습니다.", statusCode: 201, data: company };
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }

            console.error(error);
            throw new InternalServerErrorException("회사 생성과정 중 서버에서 에러가 발생했습니다.");
        }

    }
}

