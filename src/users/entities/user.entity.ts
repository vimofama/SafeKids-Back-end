import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRoles } from './user-roles.enum';
import { Student } from '../../students/entities/student.entity';
import { ActionLog } from 'src/action-logs/entities/action-log.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text')
  password: string;

  @Column('text')
  fullName: string;

  @Column('text', {
    unique: true,
  })
  ci: string;

  @Column('text', {
    unique: true,
  })
  phone: string;

  @Column('enum', {
    enum: UserRoles,
  })
  userRole: UserRoles;

  @OneToMany(() => Student, (student) => student.guardian)
  students?: Student[];

  @OneToMany(() => ActionLog, (actionLog) => actionLog.user)
  actionLogs: ActionLog[];
}
