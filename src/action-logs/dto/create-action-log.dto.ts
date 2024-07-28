import { Type } from 'class-transformer';
import { IsDate, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateActionLogDto {
  @IsUUID()
  userId?: string;

  @IsDate()
  @Type(() => Date)
  timestamp: Date;

  @IsString()
  @MinLength(1)
  action: string;
}
