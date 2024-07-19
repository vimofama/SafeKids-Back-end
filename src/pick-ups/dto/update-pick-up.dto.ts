import { PartialType } from '@nestjs/mapped-types';
import { CreatePickUpDto } from './create-pick-up.dto';

export class UpdatePickUpDto extends PartialType(CreatePickUpDto) {}
