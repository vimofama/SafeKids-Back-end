import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  @MinLength(1)
  fullName: string;

  @IsString()
  @MinLength(10)
  ci: string;

  @IsString()
  @IsOptional()
  imageURL?: string;

  @IsUUID()
  guardianId: string;
}
