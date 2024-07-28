import { Controller, Get } from '@nestjs/common';
import { ActionLogsService } from './action-logs.service';
import { Auth, GetUser } from 'src/users/decorators';
import { Csrf } from 'ncsrf';
import { UserRoles } from 'src/users/entities/user-roles.enum';

@Controller('action-logs')
export class ActionLogsController {
  constructor(private readonly actionLogsService: ActionLogsService) {}

  @Get()
  @Auth(UserRoles.ADMINISTRATOR)
  @Csrf()
  findAll() {
    return this.actionLogsService.findAll();
  }
}
