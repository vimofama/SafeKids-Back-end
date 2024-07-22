import { Type } from 'class-transformer';
import { IsDate, IsString, IsUUID, MinLength } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateActionLogDto {
  @Type(() => User)
  user?: User;

  @IsDate()
  @Type(() => Date)
  timestamp: Date;

  @IsString()
  @MinLength(1)
  action: string;
}
