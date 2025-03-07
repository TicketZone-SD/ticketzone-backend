/*import { Injectable, NotFoundException } from '@nestjs/common';
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
*/

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Event } from '../events/entities/event.entity';
import { TicketType } from '../types/entities/ticket-type.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,

    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,

    @InjectRepository(TicketType)
    private readonly ticketTypeRepository: Repository<TicketType>,
  ) {}

  // Criação de um novo pedido (Order)
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // 1. Verificar se o user_id é válido
    if (createOrderDto.user_id <= 0) {
      throw new BadRequestException('User ID must be a positive number');
    }

    // 2. Verificar se o evento existe
    const event = await this.eventsRepository.findOne({
      where: { id: createOrderDto.event_id },
    });
    if (!event) {
      throw new NotFoundException(
        `Event with ID ${createOrderDto.event_id} not found`,
      );
    }

    // 3. Verificar se o ticket type existe
    const ticketType = await this.ticketTypeRepository.findOne({
      where: { id: createOrderDto.ticket_type_id },
    });
    if (!ticketType) {
      throw new NotFoundException(
        `TicketType with ID ${createOrderDto.ticket_type_id} not found`,
      );
    }

    // 4. Verificar se o ticket type pertence ao mesmo evento
    if (ticketType.event_id !== createOrderDto.event_id) {
      throw new BadRequestException(
        `TicketType with ID ${createOrderDto.ticket_type_id} does not belong to Event with ID ${createOrderDto.event_id}`,
      );
    }

    // 5. Verificar disponibilidade de ingressos:
    // Somar a quantidade de orders já feitas para esse ticket_type
    const existingOrders = await this.ordersRepository.find({
      where: { ticket_type_id: createOrderDto.ticket_type_id },
    });
    const soldQuantity = existingOrders.reduce(
      (sum, order) => sum + order.quantity,
      0,
    );
    if (soldQuantity + createOrderDto.quantity > ticketType.capacity) {
      throw new BadRequestException(
        'Not enough tickets available for this ticket type',
      );
    }

    // 6. Recalcular o total_price e compará-lo com o enviado
    const recalculatedTotal = ticketType.price * createOrderDto.quantity;
    if (Math.abs(recalculatedTotal - createOrderDto.total_price) > 0.01) {
      // Permite pequena margem de erro de arredondamento (0.01)
      throw new BadRequestException(
        'Total price does not match the calculated value',
      );
    }

    // Se todas as validações passarem, cria a order
    const orderData: DeepPartial<Order> = {
      ...createOrderDto,
      // Opcionalmente, você pode omitir o total_price, já que ele pode ser recalculado
      total_price: recalculatedTotal,
    };

    const order = this.ordersRepository.create(orderData);
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
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  // Atualiza um pedido existente
  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    // Busca a order existente
    const order = await this.findOne(id);

    // Se o update modificar o event_id ou ticket_type_id ou quantity,
    // refaça as mesmas validações:
    // 1. Se event_id for alterado, verifique se o evento existe
    if (updateOrderDto.event_id && updateOrderDto.event_id !== order.event_id) {
      const event = await this.eventsRepository.findOne({
        where: { id: updateOrderDto.event_id },
      });
      if (!event) {
        throw new NotFoundException(
          `Event with ID ${updateOrderDto.event_id} not found`,
        );
      }
      order.event_id = updateOrderDto.event_id;
    }

    // 2. Se ticket_type_id for alterado, verifique se o ticket type existe e pertence ao mesmo evento
    if (
      updateOrderDto.ticket_type_id &&
      updateOrderDto.ticket_type_id !== order.ticket_type_id
    ) {
      const ticketType = await this.ticketTypeRepository.findOne({
        where: { id: updateOrderDto.ticket_type_id },
      });
      if (!ticketType) {
        throw new NotFoundException(
          `TicketType with ID ${updateOrderDto.ticket_type_id} not found`,
        );
      }
      // Verifica se o ticket type pertence ao evento associado
      if (ticketType.event_id !== (updateOrderDto.event_id || order.event_id)) {
        throw new BadRequestException(
          `TicketType with ID ${updateOrderDto.ticket_type_id} does not belong to Event with ID ${updateOrderDto.event_id || order.event_id}`,
        );
      }
      order.ticket_type_id = updateOrderDto.ticket_type_id;
    }

    // 3. Se quantity for atualizada, verifique a disponibilidade de ingressos
    if (updateOrderDto.quantity !== undefined) {
      // Busca todas as orders para esse ticket type, subtraindo a quantidade da order atual (pois ela será substituída)
      const existingOrders = await this.ordersRepository.find({
        where: { ticket_type_id: order.ticket_type_id },
      });
      const soldQuantity = existingOrders.reduce((sum, o) => {
        // Exclui a order atual do somatório, se estiver atualizando
        return o.id === order.id ? sum : sum + o.quantity;
      }, 0);
      // Para obter a capacidade, buscamos o ticket type
      const ticketType = await this.ticketTypeRepository.findOne({
        where: { id: order.ticket_type_id },
      });
      if (!ticketType) {
        throw new NotFoundException(
          `TicketType with ID ${order.ticket_type_id} not found`,
        );
      }
      if (soldQuantity + updateOrderDto.quantity > ticketType.capacity) {
        throw new BadRequestException(
          'Not enough tickets available for this ticket type',
        );
      }
      order.quantity = updateOrderDto.quantity;
    }

    // 4. Recalcular total_price se quantity or ticket_type_id or price change
    // Para isso, pegamos o ticketType atual (ou atualizado, se ticket_type_id mudou)
    const ticketType = await this.ticketTypeRepository.findOne({
      where: { id: order.ticket_type_id },
    });
    if (!ticketType) {
      throw new NotFoundException(
        `TicketType with ID ${order.ticket_type_id} not found`,
      );
    }
    // Se updateOrderDto.total_price for fornecido, recalcular e comparar
    const newQuantity =
      updateOrderDto.quantity !== undefined
        ? updateOrderDto.quantity
        : order.quantity;
    const recalculatedTotal = ticketType.price * newQuantity;
    if (
      updateOrderDto.total_price !== undefined &&
      Math.abs(recalculatedTotal - updateOrderDto.total_price) > 0.01
    ) {
      throw new BadRequestException(
        'Total price does not match the calculated value',
      );
    }
    // Atualiza o total_price para o valor recalculado
    order.total_price = recalculatedTotal;

    // Se updateOrderDto.status for fornecido, atualize também (a lógica de pagamento ou liberação de capacidade pode ser feita em outra camada)
    if (updateOrderDto.status !== undefined) {
      order.status = updateOrderDto.status;
    }

    // Atualiza outros campos que possam ser enviados
    Object.assign(order, updateOrderDto);
    return this.ordersRepository.save(order);
  }

  // Remove um pedido pelo ID
  async remove(id: number): Promise<void> {
    const result = await this.ordersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }
}
