import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypesService } from './types.service';
import { TypesController } from './types.controller';
import { TicketType } from './entities/ticket-type.entity';
import { Event } from '../events/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketType, Event])],
  controllers: [TypesController],
  providers: [TypesService],
})
export class TypesModule {}
