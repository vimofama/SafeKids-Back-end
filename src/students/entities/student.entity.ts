import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthorizedPerson } from '../../authorized-persons/entities/authorized-person.entity';
import { User } from '../../users/entities/user.entity';

@Entity('student')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  fullName: string;

  @Column('text', {
    unique: true,
  })
  ci: string;

  @ManyToOne(() => User, (user) => user.students, { eager: true })
  guardian: User;

  @OneToMany(
    () => AuthorizedPerson,
    (authorizedPerson) => authorizedPerson.student,
    { eager: true },
  )
  authorizedPersons: AuthorizedPerson[];
}
