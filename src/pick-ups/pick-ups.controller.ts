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
import { PickUpsService } from './pick-ups.service';
import { CreatePickUpDto } from './dto/create-pick-up.dto';
import { UpdatePickUpDto } from './dto/update-pick-up.dto';
import { Auth, GetUser } from 'src/users/decorators';
import { UserRoles } from 'src/users/entities/user-roles.enum';
import { User } from 'src/users/entities/user.entity';
import { Csrf } from 'ncsrf';

@Controller('pick-ups')
export class PickUpsController {
  constructor(private readonly pickUpsService: PickUpsService) {}

  @Post()
  @Auth(UserRoles.ADMINISTRATOR, UserRoles.SECURITY_PERSONNEL)
  @Csrf()
  create(@Body() createPickUpDto: CreatePickUpDto, @GetUser() user: User) {
    return this.pickUpsService.create(createPickUpDto, user);
  }

  @Get()
  @Auth()
  @Csrf()
  findAll(@GetUser() user: User) {
    return this.pickUpsService.findAll(user);
  }

  @Get('get-today-pick-ups')
  @Auth(UserRoles.ADMINISTRATOR, UserRoles.SECURITY_PERSONNEL)
  @Csrf()
  getTodayPickUps(@GetUser() user: User) {
    return this.pickUpsService.getTodaysPickUps(user);
  }

  @Get(':id')
  @Auth(UserRoles.ADMINISTRATOR, UserRoles.SECURITY_PERSONNEL)
  @Csrf()
  findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.pickUpsService.findOne(id, user);
  }

  @Patch(':id')
  @Auth(UserRoles.ADMINISTRATOR, UserRoles.SECURITY_PERSONNEL)
  @Csrf()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePickUpDto: UpdatePickUpDto,
    @GetUser() user: User,
  ) {
    return this.pickUpsService.update(id, updatePickUpDto, user);
  }

  @Delete(':id')
  @Auth(UserRoles.ADMINISTRATOR, UserRoles.SECURITY_PERSONNEL)
  @Csrf()
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.pickUpsService.remove(id, user);
  }
}
