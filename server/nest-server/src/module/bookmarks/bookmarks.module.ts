import { Module } from '@nestjs/common';
import { BookmarksController } from './bookmarks.controller';
import { BookmarksService } from './bookmarks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookmarks } from './entity/bookmarks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmarks])],
  controllers: [BookmarksController],
  providers: [BookmarksService]
})
export class BookmarksModule { }
