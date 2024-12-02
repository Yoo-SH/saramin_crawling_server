import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Bookmarks } from './entity/bookmarks.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BookmarksService {
    constructor(@InjectRepository(Bookmarks) private readonly repo_bookmarks: Repository<Bookmarks>) { }

    async createBookmarkToggle(user_id: number, job_id: number) {
        try {
            if (!job_id) {
                throw new NotFoundException('job_id가 없습니다.');
            }
            const existingBookmark = await this.repo_bookmarks.findOne({ where: { user: { id: user_id }, job: { id: job_id } }, relations: ['user', 'job'] });

            if (existingBookmark) {
                await this.repo_bookmarks.delete({ user: { id: user_id }, job: { id: job_id } });
                return { messeges: '북마크가 해제되었습니다.', data: { user: existingBookmark.user.id, job: existingBookmark.job.id }, statusCode: 200 };
            }

            const bookmark = this.repo_bookmarks.create({ user: { id: user_id }, job: { id: job_id } });
            await this.repo_bookmarks.save(bookmark);
            return { messeges: '북마크가 되었습니다', data: { user: bookmark.user.id, job: bookmark.job.id }, statusCode: 200, };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.log(error);
            throw new InternalServerErrorException("북마크 토글과정 중 서버에서 에러가 발생했습니다.");
        }
    }

}
