import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthorizedPersonsService } from './authorized-persons.service';
import { CreateAuthorizedPersonDto } from './dto/create-authorized-person.dto';
import { UpdateAuthorizedPersonDto } from './dto/update-authorized-person.dto';
import { Auth, GetUser } from 'src/users/decorators';
import { UserRoles } from 'src/users/entities/user-roles.enum';
import { User } from 'src/users/entities/user.entity';

@Controller('authorized-persons')
export class AuthorizedPersonsController {
  constructor(
    private readonly authorizedPersonsService: AuthorizedPersonsService,
  ) {}

  @Post()
  @Auth(UserRoles.ADMINISTRATOR, UserRoles.GUARDIAN)
  create(
    @Body() createAuthorizedPersonDto: CreateAuthorizedPersonDto,
    @GetUser() user: User,
  ) {
    return this.authorizedPersonsService.create(createAuthorizedPersonDto, user);
  }

  @Get()
  @Auth(UserRoles.ADMINISTRATOR, UserRoles.SECURITY_PERSONNEL)
  findAll(@GetUser() user: User) {
    return this.authorizedPersonsService.findAll(user);
  }

  @Get(':id')
  @Auth(UserRoles.ADMINISTRATOR, UserRoles.SECURITY_PERSONNEL)
  findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.authorizedPersonsService.findOne(id, user);
  }

  @Get(':id')
  @Auth(UserRoles.ADMINISTRATOR, UserRoles.GUARDIAN)
  findAllByGuardian(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ) {
    return this.authorizedPersonsService.findAllByGuardian(id, user);
  }

  @Patch(':id')
  @Auth(UserRoles.ADMINISTRATOR, UserRoles.GUARDIAN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAuthorizedPersonDto: UpdateAuthorizedPersonDto,
    @GetUser() user: User,
  ) {
    return this.authorizedPersonsService.update(id, updateAuthorizedPersonDto, user);
  }

  @Delete(':id')
  @Auth(UserRoles.ADMINISTRATOR, UserRoles.GUARDIAN)
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.authorizedPersonsService.remove(id, user);
  }
}