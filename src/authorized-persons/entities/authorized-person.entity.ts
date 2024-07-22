import { Student } from '../../students/entities/student.entity';
import { PickUp } from '../../pick-ups/entities/pick-up.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('authorized-person')
export class AuthorizedPerson {
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

  @Column('text', {
    unique: true,
  })
  phone: string;

  @ManyToOne(() => Student, (student) => student.authorizedPersons)
  student: Student;

  @OneToMany(() => PickUp, (pickUp) => pickUp.authorizedPerson)
  pickUps: PickUp[];
}
