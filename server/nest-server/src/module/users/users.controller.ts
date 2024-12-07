import { Controller, Get, Query, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseGetUsersAllDto } from './dto/response/response-get-users-all.dto';
import { ResponseGetUsersSearchDto } from './dto/response/response-get-users-search.dto';
import { ResponseGetUsersIdDto } from './dto/response/response-get-users-id.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private UsersService: UsersService) { }

    @ApiOperation({ summary: '모든 유저 조회' })
    @ApiResponse({ status: 200, description: '성공(data는 array)', type: ResponseGetUsersAllDto })
    @ApiResponse({ status: 404, description: '사용자가 존재하지 않습니다.', type: ErrorResponseDto })
    @ApiResponse({ status: 500, description: '사용자 조회 중 오류가 발생했습니다.', type: ErrorResponseDto })
    @Get('all')
    findAllUsers() {
        return this.UsersService.findAllUsers();
    }


    @ApiOperation({ summary: '유저 이름으로 특정 유저 조회' })
    @ApiResponse({ status: 200, description: '성공', type: ResponseGetUsersSearchDto })
    @ApiResponse({ status: 404, description: '해당 이름의 사용자가 존재하지 않습니다.', type: ErrorResponseDto })
    @ApiResponse({ status: 500, description: '사용자 조회 중 오류가 발생했습니다.', type: ErrorResponseDto })
    @Get('search')
    findUsersByName(@Query('name') name?: string) {
        return this.UsersService.findUsersByName(name);
    }

    @ApiOperation({ summary: '특정 유저 조회' })
    @ApiResponse({ status: 200, description: '성공', type: ResponseGetUsersIdDto })
    @ApiResponse({ status: 404, description: '해당 id의 사용자가 존재하지 않습니다.', type: ErrorResponseDto })
    @ApiResponse({ status: 500, description: '사용자 조회 중 오류가 발생했습니다.', type: ErrorResponseDto })
    @Get(':id')
    findUsersById(@Param('id') id: number) {
        return this.UsersService.findUsersById(id);
    }

}

