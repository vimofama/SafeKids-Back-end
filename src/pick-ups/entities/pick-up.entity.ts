import { AuthorizedPerson } from 'src/authorized-persons/entities/authorized-person.entity';
import { Student } from 'src/students/entities/student.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pick-up')
export class PickUp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', nullable: true })
  timestamp?: Date;

  @ManyToOne(
    () => AuthorizedPerson,
    (authorizedPerson) => authorizedPerson.pickUps,
    { nullable: true },
  )
  authorizedPerson?: AuthorizedPerson;

  @ManyToOne(() => Student, (student) => student.pickUps)
  student: Student;

  @Column({ type: 'boolean', default: false })
  isPickedUp: boolean;
}
