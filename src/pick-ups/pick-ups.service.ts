import { Injectable } from '@nestjs/common';
import { CreatePickUpDto } from './dto/create-pick-up.dto';
import { UpdatePickUpDto } from './dto/update-pick-up.dto';

@Injectable()
export class PickUpsService {
  create(createPickUpDto: CreatePickUpDto) {
    return 'This action adds a new pickUp';
  }

  findAll() {
    return `This action returns all pickUps`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pickUp`;
  }

  update(id: number, updatePickUpDto: UpdatePickUpDto) {
    return `This action updates a #${id} pickUp`;
  }

  remove(id: number) {
    return `This action removes a #${id} pickUp`;
  }
}
