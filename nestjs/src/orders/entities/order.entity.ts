import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Event } from '../../events/entities/event.entity';
import { TicketType } from '../../types/entities/ticket-type.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  // Mantém a coluna de ID explicitamente
  @Column({ type: 'int' })
  user_id: number;

  @ManyToOne(() => Event, (event) => event.id, { eager: false })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column({ type: 'int' })
  event_id: number;

  @ManyToOne(() => TicketType, (ticketType) => ticketType.id, { eager: false })
  @JoinColumn({ name: 'ticket_type_id' })
  ticketType: TicketType;

  @Column({ type: 'int' })
  ticket_type_id: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'float' })
  total_price: number;

  @Column({
    type: 'enum',
    enum: ['Pendente', 'Pago', 'Cancelado'],
    default: 'Pendente',
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
