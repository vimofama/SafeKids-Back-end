import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateAuthorizedPersonDto {
  @IsString()
  @MinLength(1)
  fullName: string;

  @IsString()
  @MinLength(10)
  ci: string;

  @IsString()
  @MinLength(10)
  phone: string;

  @IsString()
  @IsOptional()
  imageURL?: string;

  @IsUUID()
  guardianId: string;
}
