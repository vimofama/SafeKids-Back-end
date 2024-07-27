import {
  AfterLoad,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PickUp } from 'src/pick-ups/entities/pick-up.entity';
import { FirebaseAdminModule } from 'src/firebase-admin/firebase-admin.module';

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
    default: 'avatar.png',
  })
  imageURL: string;

  @ManyToOne(() => User, (user) => user.students, { eager: true })
  guardian: User;

  @OneToMany(() => PickUp, (pickUp) => pickUp.student)
  pickUps: PickUp[];

  /**
   * Load image URL from Firebase Storage
   */
  @AfterLoad()
  async loadImageURL() {
    if (this.imageURL) {
      const bucket = FirebaseAdminModule.admin.storage().bucket();
      const file = bucket.file(this.imageURL);

      // Set expiration time to 1 hour
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);

      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: expiresAt,
      });
      this.imageURL = url;
    } else {
      this.imageURL =
        'https://firebasestorage.googleapis.com/v0/b/safekids-70b8b.appspot.com/o/avatar.png?alt=media&token=2bf5d1fd-e6b3-43e2-8f25-b7950df05175';
    }
  }
}
