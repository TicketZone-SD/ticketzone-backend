/*import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Order } from '../orders/entities/order.entity';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}
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
*/

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Event } from './entities/event.entity';
import { Category } from '../categories/entities/category.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Order } from '../orders/entities/order.entity';

interface TicketTypeRawResult {
  name: string;
  capacity: string;
  sold: string;
}

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  // Criação de um novo evento
  async create(createEventDto: CreateEventDto): Promise<Event> {
    // Verifica se a categoria existe
    const category = await this.categoryRepository.findOne({
      where: { id: createEventDto.category_id },
    });
    if (!category) {
      throw new NotFoundException(
        `Category with ID ${createEventDto.category_id} not found`,
      );
    }

    // Validação da data: não permitir data no passado
    const eventDate = new Date(createEventDto.date);
    const now = new Date();
    if (eventDate < now) {
      throw new BadRequestException('Event date must be in the future');
    }

    // Verifica se a capacidade e o preço são positivos
    if (createEventDto.capacity <= 0) {
      throw new BadRequestException('Event capacity must be greater than 0');
    }
    if (createEventDto.price <= 0) {
      throw new BadRequestException('Event price must be greater than 0');
    }

    // Se o organizador for gerenciado externamente (Django), apenas armazene o ID.
    // Se precisar, adicione uma validação semelhante.

    // Cria o objeto para persistência, associando o objeto Category encontrado
    const eventData: DeepPartial<Event> = {
      ...createEventDto,
      category: category,
    };

    const event = this.eventsRepository.create(eventData);
    return this.eventsRepository.save(event);
  }

  // Atualização de um evento
  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);

    // Se uma nova categoria for enviada, verifica se ela existe
    let updateData: DeepPartial<Event> = { ...updateEventDto };
    if (updateEventDto.category_id) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateEventDto.category_id },
      });
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${updateEventDto.category_id} not found`,
        );
      }
      updateData = { ...updateData, category: category };
    }

    // Se a data for atualizada, verifica se é no futuro
    if (updateEventDto.date) {
      const newDate = new Date(updateEventDto.date);
      const now = new Date();
      if (newDate < now) {
        throw new BadRequestException('Event date must be in the future');
      }
    }

    // Se a capacidade for atualizada, verifica se é positiva
    if (updateEventDto.capacity !== undefined && updateEventDto.capacity <= 0) {
      throw new BadRequestException('Event capacity must be greater than 0');
    }

    // Se o preço for atualizado, verifica se é positivo
    if (updateEventDto.price !== undefined && updateEventDto.price <= 0) {
      throw new BadRequestException('Event price must be greater than 0');
    }

    // Se a capacidade for atualizada, verifica se não fica menor que a quantidade já vendida
    if (updateEventDto.capacity !== undefined) {
      const soldTickets = await this.getSoldTickets(event.id);
      if (updateEventDto.capacity < soldTickets) {
        throw new BadRequestException(
          'New capacity cannot be less than the number of tickets already sold',
        );
      }
    }

    Object.assign(event, updateData);
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
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async findEventsByCategory(categoryId: number): Promise<Event[]> {
    // Verifica se a categoria existe
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    // Obtém a data atual
    const now = new Date();

    // Busca eventos que pertencem à categoria informada e cuja data é posterior a agora
    const events = await this.eventsRepository
      .createQueryBuilder('event')
      .where('event.category_id = :categoryId', { categoryId })
      .andWhere('event.date > :now', { now: now.toISOString() })
      .getMany();

    return events;
  }
  // Remoção de um evento
  async remove(id: number): Promise<void> {
    const result = await this.eventsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
  }

  // Método placeholder para retornar a quantidade de ingressos vendidos para um evento
  async getSoldTickets(eventId: number): Promise<number> {
    // Certifique-se de que 'ordersRepository' seja do tipo Repository<Order>
    const orders: Order[] = await this.ordersRepository.find({
      where: { event_id: eventId },
    });

    // Agora o TS sabe que 'orders' é Order[]
    const totalSold = orders.reduce((sum, o) => sum + o.quantity, 0);

    return totalSold;
  }

  // Buscar eventos filtrados por organizador
  async findEventsByOrganizer(organizerId: number): Promise<Event[]> {
    const events = await this.eventsRepository.find({
      where: { organizer: organizerId },
    });
    if (!events.length) {
      throw new NotFoundException(
        `No events found for organizer with ID ${organizerId}`,
      );
    }
    return events;
  }

  async getTicketsSoldByTypeDetailed(
    eventId: number,
  ): Promise<
    { ticketType: { name: string; capacity: number; sold: number } }[]
  > {
    // Executa uma consulta com join entre orders e ticket_types
    const rawResults = await this.ordersRepository
      .createQueryBuilder('order')
      .innerJoin(
        'ticket_types',
        'ticketType',
        'ticketType.id = order.ticket_type_id',
      )
      .select('ticketType.name', 'name')
      .addSelect('ticketType.capacity', 'capacity')
      .addSelect('SUM(order.quantity)', 'sold')
      .where('order.event_id = :eventId', { eventId })
      .andWhere('order.status != :status', { status: 'Cancelado' })
      .groupBy('ticketType.name')
      .addGroupBy('ticketType.capacity')
      .getRawMany<TicketTypeRawResult>();

    // Transforma o resultado em um array de objetos com a estrutura desejada:
    return rawResults.map((row) => ({
      ticketType: {
        name: row.name,
        capacity: Number(row.capacity),
        sold: Number(row.sold),
      },
    }));
  }
}
