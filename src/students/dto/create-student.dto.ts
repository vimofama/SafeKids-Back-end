import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @MinLength(1)
  fullName: string;

  @IsString()
  @MinLength(10)
  ci: string;

  @IsUUID()
  guardianId: string;
}
