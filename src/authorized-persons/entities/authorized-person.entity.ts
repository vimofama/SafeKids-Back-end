import { Student } from '../../students/entities/student.entity';
import { PickUp } from '../../pick-ups/entities/pick-up.entity';
import { Column, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToMany(() => Student, (student) => student.authorizedPersons)
  students: Student[];

  @OneToMany(() => PickUp, (pickUp) => pickUp.authorizedPerson)
  pickUps: PickUp[];
}
