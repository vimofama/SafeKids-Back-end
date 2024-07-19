import { Injectable } from '@nestjs/common';
import { CreateAuthorizedPersonDto } from './dto/create-authorized-person.dto';
import { UpdateAuthorizedPersonDto } from './dto/update-authorized-person.dto';

@Injectable()
export class AuthorizedPersonsService {
  create(createAuthorizedPersonDto: CreateAuthorizedPersonDto) {
    return 'This action adds a new authorizedPerson';
  }

  findAll() {
    return `This action returns all authorizedPersons`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authorizedPerson`;
  }

  update(id: number, updateAuthorizedPersonDto: UpdateAuthorizedPersonDto) {
    return `This action updates a #${id} authorizedPerson`;
  }

  remove(id: number) {
    return `This action removes a #${id} authorizedPerson`;
  }
}
