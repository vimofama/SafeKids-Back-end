import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { UsersModule } from 'src/users/users.module';
import { ActionLogsModule } from 'src/action-logs/action-logs.module';
import { FirebaseAdminModule } from 'src/firebase-admin/firebase-admin.module';

@Module({
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [TypeOrmModule, StudentsService],
  imports: [
    TypeOrmModule.forFeature([Student]),
    UsersModule,
    ActionLogsModule,
    FirebaseAdminModule,
  ],
})
export class StudentsModule {}
