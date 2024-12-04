import { Module } from '@nestjs/common';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Applications } from './entity/applications.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Applications])],
  controllers: [ApplicationsController],
  providers: [ApplicationsService]
})
export class ApplicationsModule { }
