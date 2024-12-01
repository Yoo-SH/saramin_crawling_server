import { Controller, Get, Query, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private UsersService: UsersService) { }

    @Get('all')
    findAllUsers() {
        return this.UsersService.findAllUsers();
    }


    @Get('search')
    findUsersByName(@Query('name') name?: string) {
        return this.UsersService.findUsersByName(name);
    }

    @Get(':id')
    findUsersById(@Param('id') id: number) {
        return this.UsersService.findUsersById(id);
    }

}

