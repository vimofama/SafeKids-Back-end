import { Controller, Get } from '@nestjs/common';
import { ActionLogsService } from './action-logs.service';
import { Auth, GetUser } from 'src/users/decorators';
import { Csrf } from 'ncsrf';

@Controller('action-logs')
export class ActionLogsController {
  constructor(private readonly actionLogsService: ActionLogsService) {}

  @Get()
  @Auth()
  @Csrf()
  findAll() {
    return this.actionLogsService.findAll();
  }
}
