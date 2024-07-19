import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PickUpsService } from './pick-ups.service';
import { CreatePickUpDto } from './dto/create-pick-up.dto';
import { UpdatePickUpDto } from './dto/update-pick-up.dto';

@Controller('pick-ups')
export class PickUpsController {
  constructor(private readonly pickUpsService: PickUpsService) {}

  @Post()
  create(@Body() createPickUpDto: CreatePickUpDto) {
    return this.pickUpsService.create(createPickUpDto);
  }

  @Get()
  findAll() {
    return this.pickUpsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pickUpsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePickUpDto: UpdatePickUpDto) {
    return this.pickUpsService.update(+id, updatePickUpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pickUpsService.remove(+id);
  }
}
