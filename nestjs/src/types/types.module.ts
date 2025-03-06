import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypesService } from './types.service';
import { TypesController } from './types.controller';
import { TicketType } from './entities/ticket-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketType])],
  controllers: [TypesController],
  providers: [TypesService],
})
export class TypesModule {}
