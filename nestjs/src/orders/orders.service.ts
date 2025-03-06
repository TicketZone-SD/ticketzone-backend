import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  // Criação de um novo pedido (Order)
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Converte DTO em uma instância de Order
    const order = this.ordersRepository.create(createOrderDto);
    // Salva no banco
    return this.ordersRepository.save(order);
  }

  // Retorna todos os pedidos
  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find();
  }

  // Busca um pedido específico pelo ID
  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order com ID ${id} não encontrado`);
    }
    return order;
  }

  // Atualiza um pedido existente
  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    Object.assign(order, updateOrderDto);
    return this.ordersRepository.save(order);
  }

  // Remove um pedido pelo ID
  async remove(id: number): Promise<void> {
    const result = await this.ordersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Order com ID ${id} não encontrado`);
    }
  }
}
