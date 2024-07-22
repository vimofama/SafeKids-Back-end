import { AuthorizedPerson } from 'src/authorized-persons/entities/authorized-person.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pick-up')
export class PickUp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @ManyToOne(
    () => AuthorizedPerson,
    (authorizedPerson) => authorizedPerson.pickUps,
  )
  authorizedPerson: AuthorizedPerson;
}
