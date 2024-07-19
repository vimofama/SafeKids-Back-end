import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthorizedPersonsService } from './authorized-persons.service';
import { CreateAuthorizedPersonDto } from './dto/create-authorized-person.dto';
import { UpdateAuthorizedPersonDto } from './dto/update-authorized-person.dto';

@Controller('authorized-persons')
export class AuthorizedPersonsController {
  constructor(private readonly authorizedPersonsService: AuthorizedPersonsService) {}

  @Post()
  create(@Body() createAuthorizedPersonDto: CreateAuthorizedPersonDto) {
    return this.authorizedPersonsService.create(createAuthorizedPersonDto);
  }

  @Get()
  findAll() {
    return this.authorizedPersonsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorizedPersonsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthorizedPersonDto: UpdateAuthorizedPersonDto) {
    return this.authorizedPersonsService.update(+id, updateAuthorizedPersonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorizedPersonsService.remove(+id);
  }
}
