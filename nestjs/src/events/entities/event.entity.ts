import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../entities/category.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '255', unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: '255' })
  local: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column()
  capacity: number;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'int' })
  organizer: number;

  @ManyToOne(() => Category, (category) => category.events)
  @JoinColumn({ name: 'category_id' }) // Nome da coluna no banco
  category: Category; // Aqui o relacionamento é representado por um objeto do tipo Category

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
