import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('action-log')
export class ActionLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.actionLogs)
  @JoinColumn()
  user?: User;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column('text')
  action: string;
}
