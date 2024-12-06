import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
    @ApiProperty({ example: 28 })
    id: number;

    @ApiProperty({ example: '운영진' })
    name: string;

    @ApiProperty({ example: '2024-12-01T13:44:20.452Z' })
    createAt: string;

    @ApiProperty({ example: '2024-12-06T08:18:14.554Z' })
    updateAt: string;

    @ApiProperty({ example: '2024-12-06T08:18:14.551Z' })
    lastLoginAt: string;

    @ApiProperty({ example: null })
    deleteAt: string | null;
}