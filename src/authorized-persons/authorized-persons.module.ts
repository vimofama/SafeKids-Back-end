import { Module } from '@nestjs/common';
import { AuthorizedPersonsService } from './authorized-persons.service';
import { AuthorizedPersonsController } from './authorized-persons.controller';

@Module({
  controllers: [AuthorizedPersonsController],
  providers: [AuthorizedPersonsService],
})
export class AuthorizedPersonsModule {}
