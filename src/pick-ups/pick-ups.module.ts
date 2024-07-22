import { Module } from '@nestjs/common';
import { PickUpsService } from './pick-ups.service';
import { PickUpsController } from './pick-ups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickUp } from './entities/pick-up.entity';
import { StudentsModule } from 'src/students/students.module';
import { UsersModule } from 'src/users/users.module';
import { AuthorizedPersonsModule } from 'src/authorized-persons/authorized-persons.module';
import { ActionLogsModule } from 'src/action-logs/action-logs.module';

@Module({
  controllers: [PickUpsController],
  providers: [PickUpsService],
  exports: [TypeOrmModule, PickUpsService],
  imports: [
    TypeOrmModule.forFeature([PickUp]),
    UsersModule,
    AuthorizedPersonsModule,
    StudentsModule,
    ActionLogsModule,
  ],
})
export class PickUpsModule {}
