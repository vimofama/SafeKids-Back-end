import { Type } from 'class-transformer';
import { IsDate, IsUUID } from 'class-validator';

export class CreatePickUpDto {
  @IsDate()
  @Type(() => Date)
  timestamp: Date;

  @IsUUID()
  authorizedPersonId: string;

  @IsUUID()
  studentId: string;
}
