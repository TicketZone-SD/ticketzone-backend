import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  // Criação de um novo evento
  async create(createEventDto: CreateEventDto): Promise<Event> {
    // Converte o número da categoria em um objeto com a propriedade id
    const eventData: DeepPartial<Event> = {
      ...createEventDto,
      category: { id: createEventDto.category_id },
    };

    const event = this.eventsRepository.create(eventData);
    return this.eventsRepository.save(event);
  }

  // Listagem de todos os eventos
  async findAll(): Promise<Event[]> {
    return await this.eventsRepository.find();
  }

  // Busca de um evento específico pelo ID
  async findOne(id: number): Promise<Event> {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }
    return event;
  }

  // Atualização de um evento
  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);

    // Extrai a propriedade category_id e os demais campos
    const { category_id, ...otherData } = updateEventDto;

    const updateData: DeepPartial<Event> = {
      ...otherData,
      ...(category_id ? { category_id: { id: category_id } } : {}),
    };

    const updatedEvent = Object.assign(event, updateData);
    return await this.eventsRepository.save(updatedEvent);
  }

  // Remoção de um evento
  async remove(id: number): Promise<void> {
    const result = await this.eventsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }
  }
}
