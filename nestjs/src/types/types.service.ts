import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { TicketType } from './entities/ticket-type.entity';

@Injectable()
export class TypesService {
  constructor(
    @InjectRepository(TicketType)
    private readonly ticketTypeRepository: Repository<TicketType>,
  ) {}

  // Criação de um novo ticket type
  async create(createTypeDto: CreateTypeDto): Promise<TicketType> {
    // Cria a instância com base no DTO
    const ticketType = this.ticketTypeRepository.create(createTypeDto);
    // Salva no banco de dados
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
