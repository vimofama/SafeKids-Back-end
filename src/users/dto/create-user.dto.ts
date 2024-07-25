import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserRoles } from '../entities/user-roles.enum';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*\d)(?=.*\W)(?=.*[A-Z])(?=.*[a-z])[^\n]*$/, {
    message:
      'The password must have a uppercase, lowercase letter, number and special character',
  })
  password: string;

  @IsString()
  @MinLength(1)
  fullName: string;

  @IsString()
  @MinLength(10)
  ci: string;

  @IsString()
  @MinLength(10)
  phone: string;

  @IsEnum(UserRoles)
  userRole: UserRoles;

  @IsString()
  @IsOptional()
  imageURL?: string;
}
