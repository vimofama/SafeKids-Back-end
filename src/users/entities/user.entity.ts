import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRoles } from './user-roles.enum';
import { Student } from '../../students/entities/student.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  mail: string;

  password: string;

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

  @Column('enum', {
    enum: UserRoles,
  })
  userRol: UserRoles;

  @OneToMany(() => Student, (student) => student.user)
  students: Student[];
}
