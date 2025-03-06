import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Event } from '../../events/entities/event.entity'; // Ajuste o caminho se precisar

@Entity('ticket_types')
export class TicketType {
  @PrimaryGeneratedColumn()
  id: number;

  // Se você quiser manter apenas o ID do evento sem relacionamento,
  // use apenas @Column(). Se quiser relacionamento com a entidade Event,
  // use ManyToOne + JoinColumn e uma propriedade "event: Event" no lugar.
  // Aqui vai um exemplo mantendo a FK e também a relação:
  @ManyToOne(() => Event, (event) => event.id, { eager: false })
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column({ type: 'int' })
  event_id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'int' })
  capacity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
