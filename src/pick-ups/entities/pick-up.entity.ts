import { AuthorizedPerson } from 'src/authorized-persons/entities/authorized-person.entity';
import { Student } from 'src/students/entities/student.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export class PickUp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @ManyToOne(() => Student, (student) => student.pickUps, { eager: true })
  student: Student;

  @ManyToOne(() => Student, (student) => student.pickUps, { eager: true })
  authorizedPerson: AuthorizedPerson;
}
