import { Controller, Get, Query, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private UsersService: UsersService) { }

    @ApiOperation({ summary: '모든 유저 조회' })
    @Get('all')
    findAllUsers() {
        return this.UsersService.findAllUsers();
    }


    @ApiOperation({ summary: '유저 이름으로 특정 유저 조회' })
    @Get('search')
    findUsersByName(@Query('name') name?: string) {
        return this.UsersService.findUsersByName(name);
    }

    @ApiOperation({ summary: '특정 유저 조회' })
    @Get(':id')
    findUsersById(@Param('id') id: number) {
        return this.UsersService.findUsersById(id);
    }

}

