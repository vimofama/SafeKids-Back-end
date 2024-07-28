import { forwardRef, Module } from '@nestjs/common';
import { ActionLogsService } from './action-logs.service';
import { ActionLogsController } from './action-logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionLog } from './entities/action-log.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ActionLogsController],
  providers: [ActionLogsService],
  exports: [ActionLogsService],
  imports: [
    TypeOrmModule.forFeature([ActionLog], 'logsConnection'),
    forwardRef(() => UsersModule),
  ],
})
export class ActionLogsModule {}
