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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Cria um novo pedido
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  // Retorna todos os pedidos
  @Get()
  async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  // Busca um pedido específico
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Get('user/:userId')
  async findByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Order[]> {
    return this.ordersService.findByUserId(userId);
  }

  // Atualiza um pedido
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    return this.ordersService.update(id, updateOrderDto);
  }

  // Remove um pedido
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.ordersService.remove(id);
  }
}
