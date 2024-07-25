import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthorizedPerson } from '../../authorized-persons/entities/authorized-person.entity';
import { User } from '../../users/entities/user.entity';
import { PickUp } from 'src/pick-ups/entities/pick-up.entity';

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

  @Column('text', {
    default:
      'https://firebasestorage.googleapis.com/v0/b/safekids-70b8b.appspot.com/o/avatar.png?alt=media&token=2bf5d1fd-e6b3-43e2-8f25-b7950df05175',
  })
  imageURL: string;

  @ManyToOne(() => User, (user) => user.students, { eager: true })
  guardian: User;

  @OneToMany(() => PickUp, (pickUp) => pickUp.student)
  pickUps: PickUp[];
}
