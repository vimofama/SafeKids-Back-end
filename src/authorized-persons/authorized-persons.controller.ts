import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthorizedPersonsService } from './authorized-persons.service';
import { CreateAuthorizedPersonDto } from './dto/create-authorized-person.dto';
import { Auth, GetUser } from 'src/users/decorators';
import { UserRoles } from 'src/users/entities/user-roles.enum';
import { User } from 'src/users/entities/user.entity';
import { Csrf } from 'ncsrf';

@Controller('authorized-persons')
export class AuthorizedPersonsController {
  constructor(
    private readonly authorizedPersonsService: AuthorizedPersonsService,
  ) {}

  @Post()
  @Auth(UserRoles.ADMINISTRATOR, UserRoles.GUARDIAN)
  @Csrf()
  create(
    @Body() createAuthorizedPersonDto: CreateAuthorizedPersonDto,
    @GetUser() user: User,
  ) {
    return this.authorizedPersonsService.create(
      createAuthorizedPersonDto,
      user,
    );
  }

  @Get(':term')
  @Auth(UserRoles.ADMINISTRATOR, UserRoles.SECURITY_PERSONNEL)
  @Csrf()
  findOne(@Param('term') term: string, @GetUser() user: User) {
    return this.authorizedPersonsService.findOne(term, user);
  }

  @Get('guardian/:id')
  @Auth(UserRoles.ADMINISTRATOR, UserRoles.GUARDIAN)
  @Csrf()
  findAllByGuardian(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ) {
    return this.authorizedPersonsService.findAllByGuardian(id, user);
  }
}
