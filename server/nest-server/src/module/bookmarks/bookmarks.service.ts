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
            throw new InternalServerErrorException("북마크 토글과정 중 서버에서 에러가 발생했습니다.");
        }
    }

    async getAllBookmarks(page: number = 1, limit: number = 10) {
        try {
            // 페이지네이션을 위한 offset과 limit 설정
            const offset = (page - 1) * limit;

            // 모든 북마크 데이터를 가져옵니다.
            const [bookmarks, totalCount] = await this.repo_bookmarks.findAndCount({
                relations: ['user', 'job'],
                order: { id: 'DESC' },  // 최신순으로 정렬
                skip: offset,            // 페이지네이션을 위한 시작 인덱스
                take: limit,             // 한 페이지의 최대 항목 수
            });

            if (bookmarks.length === 0) {
                throw new NotFoundException('북마크가 없습니다.');
            }

            // 사용자별로 북마크를 그룹화합니다.
            const groupedBookmarks = bookmarks.reduce((acc, bookmark) => {
                const userId = bookmark.user.id;
                if (!acc[userId]) {
                    acc[userId] = {
                        user: bookmark.user,
                        bookmark_job: [],
                    };
                }
                acc[userId].bookmarks.push(bookmark.job);
                return acc;
            }, {});

            return {
                messages: '성공',
                data: groupedBookmarks,
                total: totalCount,
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                statusCode: 200,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('북마크 조회 과정 중 서버에서 에러가 발생했습니다.');
        }
    }
}


