import { Module } from '@nestjs/common';
import { PickUpsService } from './pick-ups.service';
import { PickUpsController } from './pick-ups.controller';

@Module({
  controllers: [PickUpsController],
  providers: [PickUpsService],
})
export class PickUpsModule {}
