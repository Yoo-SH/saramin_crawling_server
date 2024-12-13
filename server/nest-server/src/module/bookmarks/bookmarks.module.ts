import { Module } from '@nestjs/common';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookmarks } from './entity/bookmarks.entity';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmarks]), JobsModule],
  controllers: [BookmarksController],
  providers: [BookmarksService]
})
export class BookmarksModule { }
