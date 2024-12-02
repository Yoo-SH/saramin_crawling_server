import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guard/jwt.auth.guard';
import { CreateBookmarkDto } from './dto/create-bookmarks.dto';
import { BookmarksService } from './bookmarks.service';

@Controller('bookmarks')
export class BookmarksController {
    constructor(private readonly bookmarksService: BookmarksService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createBookmarkToggle(@Req() req, @Body() body: CreateBookmarkDto) {
        return await this.bookmarksService.createBookmarkToggle(req.user.id, body.job_id);

    }


}
