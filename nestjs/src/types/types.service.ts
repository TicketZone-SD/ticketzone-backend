import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { TicketType } from './entities/ticket-type.entity';
import { Event } from '../events/entities/event.entity';
import { Not } from 'typeorm';

@Injectable()
export class TypesService {
  constructor(
    @InjectRepository(TicketType)
    private readonly ticketTypeRepository: Repository<TicketType>,

    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  // Criação de um novo ticket type
  async create(createTypeDto: CreateTypeDto): Promise<TicketType> {
    // Verifica se o evento existe
    const event = await this.eventsRepository.findOne({
      where: { id: createTypeDto.event_id },
    });
    if (!event) {
      throw new NotFoundException(
        `Evento com ID ${createTypeDto.event_id} não encontrado`,
      );
    }

    // Verifica se a capacidade do ticket não excede a do evento individualmente
    if (createTypeDto.capacity > event.capacity) {
      throw new BadRequestException(
        'Ticket capacity cannot exceed event capacity',
      );
    }

    // Verifica se o preço é positivo
    if (createTypeDto.price <= 0) {
      throw new BadRequestException('Ticket price must be greater than zero');
    }

    // Verifica duplicação de nome dentro do mesmo evento
    const existingName = await this.ticketTypeRepository.findOne({
      where: {
        event_id: createTypeDto.event_id,
        name: createTypeDto.name,
      },
    });
    if (existingName) {
      throw new BadRequestException(
        `Já existe um ticket com o nome "${createTypeDto.name}" para este evento.`,
      );
    }

    // Verifica a soma das capacidades dos ticket types já associados ao evento
    const existingTicketTypes = await this.ticketTypeRepository.find({
      where: { event_id: createTypeDto.event_id },
    });
    const sumExistingCapacities = existingTicketTypes.reduce(
      (sum, ticket) => sum + ticket.capacity,
      0,
    );
    const totalCapacityAfterCreation =
      sumExistingCapacities + createTypeDto.capacity;
    if (totalCapacityAfterCreation > event.capacity) {
      throw new BadRequestException(
        `Total ticket capacity (${totalCapacityAfterCreation}) exceeds event capacity (${event.capacity}).`,
      );
    }

    // Cria e salva
    const ticketType = this.ticketTypeRepository.create(createTypeDto);
    return this.ticketTypeRepository.save(ticketType);
  }

  // Retorna todos os ticket types
  async findAll(): Promise<TicketType[]> {
    return this.ticketTypeRepository.find();
  }

  // Busca um ticket type específico pelo ID
  async findOne(id: number): Promise<TicketType> {
    const ticketType = await this.ticketTypeRepository.findOne({
      where: { id },
    });
    if (!ticketType) {
      throw new NotFoundException(`TicketType com ID ${id} não encontrado`);
    }
    return ticketType;
  }

  // Atualiza um ticket type existente
  async update(id: number, updateTypeDto: UpdateTypeDto): Promise<TicketType> {
    const ticketType = await this.findOne(id);

    // Se o front permitir mudar event_id, verificar se o novo evento existe
    if (
      updateTypeDto.event_id &&
      updateTypeDto.event_id !== ticketType.event_id
    ) {
      const newEvent = await this.eventsRepository.findOne({
        where: { id: updateTypeDto.event_id },
      });
      if (!newEvent) {
        throw new NotFoundException(
          `Evento com ID ${updateTypeDto.event_id} não encontrado`,
        );
      }
      // Verifica capacidade com o novo evento
      if (
        updateTypeDto.capacity !== undefined &&
        updateTypeDto.capacity > newEvent.capacity
      ) {
        throw new BadRequestException(
          'Ticket capacity cannot exceed event capacity',
        );
      }

      // Verifica duplicação de nome no novo evento
      if (updateTypeDto.name) {
        const existingName = await this.ticketTypeRepository.findOne({
          where: {
            event_id: updateTypeDto.event_id,
            name: updateTypeDto.name,
          },
        });
        if (existingName) {
          throw new BadRequestException(
            `Já existe um ticket com o nome "${updateTypeDto.name}" para este evento.`,
          );
        }
      }
      ticketType.event_id = updateTypeDto.event_id;
    } else {
      // Se não mudou event_id, mas alterou a capacity, checa com o evento atual
      if (updateTypeDto.capacity !== undefined && updateTypeDto.capacity > 0) {
        const currentEvent = await this.eventsRepository.findOne({
          where: { id: ticketType.event_id },
        });
        if (currentEvent && updateTypeDto.capacity > currentEvent.capacity) {
          throw new BadRequestException(
            'Ticket capacity cannot exceed event capacity',
          );
        }
      }
    }

    // Verifica preço
    if (updateTypeDto.price !== undefined && updateTypeDto.price <= 0) {
      throw new BadRequestException('Ticket price must be greater than zero');
    }

    // Se a capacidade for atualizada, verifica a soma das capacidades dos outros ticket types
    if (updateTypeDto.capacity !== undefined) {
      // Busca todos os ticket types para esse evento, exceto o atual
      const otherTicketTypes = await this.ticketTypeRepository.find({
        where: {
          event_id: updateTypeDto.event_id
            ? updateTypeDto.event_id
            : ticketType.event_id,
          id: Not(ticketType.id), // usa Not para excluir o ticket atual
        },
      });
      const sumOtherCapacities = otherTicketTypes.reduce(
        (sum, t) => sum + t.capacity,
        0,
      );
      const newTotalCapacity = sumOtherCapacities + updateTypeDto.capacity;
      const event = await this.eventsRepository.findOne({
        where: {
          id: updateTypeDto.event_id
            ? updateTypeDto.event_id
            : ticketType.event_id,
        },
      });
      if (event && newTotalCapacity > event.capacity) {
        throw new BadRequestException(
          `Total ticket capacity (${newTotalCapacity}) exceeds event capacity (${event.capacity}).`,
        );
      }
    }

    Object.assign(ticketType, updateTypeDto);
    return this.ticketTypeRepository.save(ticketType);
  }

  // Remove um ticket type pelo ID
  async remove(id: number): Promise<void> {
    const result = await this.ticketTypeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`TicketType com ID ${id} não encontrado`);
    }
  }
}
