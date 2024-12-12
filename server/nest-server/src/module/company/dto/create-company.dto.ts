import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
    @ApiProperty({ example: 5 })
    @IsNumber()
    @IsNotEmpty({ message: '회사 ID는 필수 입력 값입니다.' })
    readonly company_id: number;

    @ApiProperty({ example: '씨아이랩스' })
    @IsString({ message: '회사명은 문자열이어야 합니다.' })
    @IsNotEmpty({ message: '회사명은 필수 입력 값입니다.' })
    readonly name: string;
}