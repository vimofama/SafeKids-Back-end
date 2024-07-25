import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRoles } from './user-roles.enum';
import { Student } from '../../students/entities/student.entity';
import { ActionLog } from 'src/action-logs/entities/action-log.entity';
import { AuthorizedPerson } from '../../authorized-persons/entities/authorized-person.entity';

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

  @Column('text', {
    default:
      'https://firebasestorage.googleapis.com/v0/b/safekids-70b8b.appspot.com/o/avatar.png?alt=media&token=2bf5d1fd-e6b3-43e2-8f25-b7950df05175',
  })
  imageURL: string;

  @OneToMany(() => Student, (student) => student.guardian)
  students: Student[];

  @OneToMany(
    () => AuthorizedPerson,
    (authorizedPerson) => authorizedPerson.guardian,
  )
  authorizedPersons: AuthorizedPerson[];

  @OneToMany(() => ActionLog, (actionLog) => actionLog.user)
  actionLogs: ActionLog[];
}
