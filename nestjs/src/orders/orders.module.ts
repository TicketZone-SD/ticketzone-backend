import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TicketType } from '../types/entities/ticket-type.entity';
import { Order } from './entities/order.entity';
import { Event } from '../events/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Event, TicketType])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
