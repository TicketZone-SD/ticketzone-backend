import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TypesService } from './types.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { TicketType } from './entities/ticket-type.entity';

@Controller('types')
export class TypesController {
  constructor(private readonly typesService: TypesService) {}

  // Cria um novo ticket type
  @Post()
  async create(@Body() createTypeDto: CreateTypeDto): Promise<TicketType> {
    return this.typesService.create(createTypeDto);
  }

  // Retorna todos os ticket types
  @Get()
  async findAll(): Promise<TicketType[]> {
    return this.typesService.findAll();
  }

  // Busca um ticket type específico pelo ID
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TicketType> {
    return this.typesService.findOne(id);
  }

  // Atualiza um ticket type
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTypeDto: UpdateTypeDto,
  ): Promise<TicketType> {
    return this.typesService.update(id, updateTypeDto);
  }

  // Remove um ticket type
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.typesService.remove(id);
  }
}
