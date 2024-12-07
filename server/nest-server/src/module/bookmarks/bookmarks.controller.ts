import { Controller, Post, Get, UseGuards, Req, Body } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guard/jwt.auth.guard';
import { CreateBookmarkDto } from './dto/request/create-bookmarks.dto';
import { BookmarksService } from './bookmarks.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResponseGetBookmarksDto } from './dto/response/response-get-bookmarks.dto';
import { ResponsePostBookmarksDto } from './dto/response/response-post-bookmarks.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

@ApiTags('bookmarks')
@Controller('bookmarks')
export class BookmarksController {
    constructor(private readonly bookmarksService: BookmarksService) { }

    @ApiOperation({ summary: '북마크 추가 및 삭제' })
    @ApiResponse({ status: 201, description: '북마크가 되었습니다', type: ResponsePostBookmarksDto })
    @ApiResponse({ status: 201, description: '북마크가 해제되었습니다.', type: ResponsePostBookmarksDto })
    @ApiResponse({ status: 500, description: '북마크 토글과정 중 서버에서 에러가 발생했습니다.', type: ErrorResponseDto })
    @UseGuards(JwtAuthGuard)
    @Post()
    async createBookmarkToggle(@Req() req, @Body() body: CreateBookmarkDto) {
        return await this.bookmarksService.createBookmarkToggle(req.user.id, body.job_id);
    }

    @ApiOperation({ summary: '북마크 조회' })
    @ApiResponse({ status: 200, description: '북마크 조회 성공', type: ResponseGetBookmarksDto })
    @ApiResponse({ status: 404, description: '북마크가 없습니다.', type: ErrorResponseDto })
    @ApiResponse({ status: 500, description: '북마크 조회 과정 중 서버에서 에러가 발생했습니다.', type: ErrorResponseDto })
    @Get()
    async getAllBookmarks() {
        return await this.bookmarksService.getAllBookmarks();
    }


}
