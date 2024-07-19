import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { PickUpsModule } from './pick-ups/pick-ups.module';
import { AuthorizedPersonsModule } from './authorized-persons/authorized-persons.module';

@Module({
  imports: [UsersModule, StudentsModule, PickUpsModule, AuthorizedPersonsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
