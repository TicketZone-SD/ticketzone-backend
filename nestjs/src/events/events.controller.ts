import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ForbiddenException,
  Query,
  //UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event as EventEntity } from './entities/event.entity';
//import { RolesGuard } from '../guards/roles.guard';

@Controller('events')
//@UseGuards(RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    if (createEventDto.role !== 'organizer') {
      throw new ForbiddenException('Only organizers can create events');
    }
    return this.eventsService.create(createEventDto);
  }

  @Get()
  async findAll() {
    return this.eventsService.findAll();
  }

  @Get('search')
  async searchByName(@Query('q') query: string): Promise<EventEntity[]> {
    return this.eventsService.searchByName(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    if (updateEventDto.role !== 'organizer') {
      throw new ForbiddenException('Only organizers can update events');
    }
    return this.eventsService.update(id, updateEventDto);
  }
  // Buscar eventos por categoria com data futura
  @Get('category/:categoryId')
  async findByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.eventsService.findEventsByCategory(categoryId);
  }

  // Obter a soma dos ingressos vendidos por tipo para um evento
  @Get(':id/tickets-sold-detailed')
  async getTicketsSoldByTypeDetailed(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.getTicketsSoldByTypeDetailed(id);
  }

  // Retornar a quantidade de ingressos vendidos para um evento
  @Get(':id/sold-tickets')
  async getSoldTickets(@Param('id', ParseIntPipe) id: number) {
    const sold = await this.eventsService.getSoldTickets(id);
    return { eventId: id, soldTickets: sold };
  }

  // Buscar eventos por organizador
  @Get('organizer/:organizerId')
  async findByOrganizer(
    @Param('organizerId', ParseIntPipe) organizerId: number,
  ) {
    return this.eventsService.findEventsByOrganizer(organizerId);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.remove(id);
  }
}
