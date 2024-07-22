import { Controller, Get } from '@nestjs/common';
import { ActionLogsService } from './action-logs.service';
import { Auth, GetUser } from 'src/users/decorators';
import { User } from 'src/users/entities/user.entity';

@Controller('action-logs')
export class ActionLogsController {
  constructor(private readonly actionLogsService: ActionLogsService) {}

  @Get()
  @Auth()
  findAll() {
    return this.actionLogsService.findAll();
  }
}
