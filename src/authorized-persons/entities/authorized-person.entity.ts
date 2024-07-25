import { PickUp } from '../../pick-ups/entities/pick-up.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

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

  @Column('text', {
    default:
      'https://firebasestorage.googleapis.com/v0/b/safekids-70b8b.appspot.com/o/avatar.png?alt=media&token=2bf5d1fd-e6b3-43e2-8f25-b7950df05175',
  })
  imageURL: string;

  @ManyToOne(() => User, (user) => user.authorizedPersons, { eager: true })
  guardian: User;

  @OneToMany(() => PickUp, (pickUp) => pickUp.authorizedPerson)
  pickUps: PickUp[];
}
