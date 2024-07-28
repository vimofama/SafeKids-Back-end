import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('action-log')
export class ActionLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: true })
  userId?: string;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column('text')
  action: string;
}
