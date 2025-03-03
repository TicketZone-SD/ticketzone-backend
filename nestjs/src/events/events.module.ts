import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Category } from '../entities/category.entity'; // ou o caminho correto
import { EventsService } from './events.service';
import { EventsController } from './events.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Category])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
