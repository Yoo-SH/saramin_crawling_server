import { Controller, Get, Query, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseGetUsersAllDto } from './dto/response/response-get-users-all.dto';
import { ResponseGetUsersSearchDto } from './dto/response/response-get-users-search.dto';
import { ResponseGetUsersIdDto } from './dto/response/response-get-users-id.dto';
@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private UsersService: UsersService) { }

    @ApiOperation({ summary: '모든 유저 조회' })
    @ApiResponse({ status: 200, description: '성공(data는 array)', type: ResponseGetUsersAllDto })
    @Get('all')
    findAllUsers() {
        return this.UsersService.findAllUsers();
    }


    @ApiOperation({ summary: '유저 이름으로 특정 유저 조회' })
    @ApiResponse({ status: 200, description: '성공', type: ResponseGetUsersSearchDto })
    @Get('search')
    findUsersByName(@Query('name') name?: string) {
        return this.UsersService.findUsersByName(name);
    }

    @ApiOperation({ summary: '특정 유저 조회' })
    @ApiResponse({ status: 200, description: '성공', type: ResponseGetUsersIdDto })
    @Get(':id')
    findUsersById(@Param('id') id: number) {
        return this.UsersService.findUsersById(id);
    }

}

