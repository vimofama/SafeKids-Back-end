import {
  Column,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthorizedPerson } from '../../authorized-persons/entities/authorized-person.entity';
import { PickUp } from '../../pick-ups/entities/pick-up.entity';
import { User } from '../../users/entities/user.entity';

export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  @Column('text', {
    unique: true,
  })
  fullName: string;

  @Column('text', {
    unique: true,
  })
  ci: string;

  @Column('text', {
    unique: true,
  })
  course: string;

  @ManyToOne(() => User, (user) => user.students, { eager: true })
  user: User;

  @OneToMany(() => PickUp, (pickUp) => pickUp.student)
  pickUps: PickUp[];

  @ManyToMany(
    () => AuthorizedPerson,
    (authorizedPerson) => authorizedPerson.students,
  )
  @JoinTable()
  authorizedPersons: AuthorizedPerson[];
}
