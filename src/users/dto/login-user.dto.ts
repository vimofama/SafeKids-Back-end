import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class LoginUserDto {
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
}
