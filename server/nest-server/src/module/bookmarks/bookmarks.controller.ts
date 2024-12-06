import { Controller, Post, Get, UseGuards, Req, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guard/jwt.auth.guard';
import { CreateBookmarkDto } from './dto/create-bookmarks.dto';
import { BookmarksService } from './bookmarks.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('bookmarks')
@Controller('bookmarks')
export class BookmarksController {
    constructor(private readonly bookmarksService: BookmarksService) { }

    @ApiOperation({ summary: '북마크 추가 및 삭제' })
    @UseGuards(JwtAuthGuard)
    @Post()
    async createBookmarkToggle(@Req() req, @Body() body: CreateBookmarkDto) {
        return await this.bookmarksService.createBookmarkToggle(req.user.id, body.job_id);
    }

    @ApiOperation({ summary: '북마크 조회' })
    @Get()
    async getAllBookmarks() {
        return await this.bookmarksService.getAllBookmarks();
    }


}
