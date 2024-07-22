import { Module } from '@nestjs/common';
import { AuthorizedPersonsService } from './authorized-persons.service';
import { AuthorizedPersonsController } from './authorized-persons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizedPerson } from './entities/authorized-person.entity';
import { UsersModule } from 'src/users/users.module';
import { StudentsModule } from 'src/students/students.module';
import { ActionLogsModule } from 'src/action-logs/action-logs.module';

@Module({
  controllers: [AuthorizedPersonsController],
  providers: [AuthorizedPersonsService],
  exports: [TypeOrmModule, AuthorizedPersonsService],
  imports: [
    TypeOrmModule.forFeature([AuthorizedPerson]),
    UsersModule,
    StudentsModule,
    ActionLogsModule,
  ],
})
export class AuthorizedPersonsModule {}
