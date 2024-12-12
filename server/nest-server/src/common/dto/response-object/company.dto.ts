import { ApiProperty } from '@nestjs/swagger';

export class CompanyDto {
    @ApiProperty({ example: 1 })
    readonly company_id: number;

    @ApiProperty({ example: '씨아이랩스' })
    readonly name: string;

    @ApiProperty({ example: new Date() })
    readonly createdAt: Date;

    @ApiProperty({ example: new Date() })
    readonly updatedAt: Date;

    @ApiProperty({ example: new Date() })
    readonly deletedAt: Date;
}