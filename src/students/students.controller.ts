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
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Auth, GetUser } from 'src/users/decorators';
import { UserRoles } from 'src/users/entities/user-roles.enum';
import { User } from 'src/users/entities/user.entity';
import { Csrf } from 'ncsrf';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Auth(UserRoles.ADMINISTRATOR)
  @Csrf()
  create(@Body() createStudentDto: CreateStudentDto, @GetUser() user: User) {
    return this.studentsService.create(createStudentDto, user);
  }

  @Get()
  @Auth(UserRoles.ADMINISTRATOR, UserRoles.SECURITY_PERSONNEL)
  @Csrf()
  findAll(@GetUser() user: User) {
    return this.studentsService.findAll(user);
  }

  @Get(':id')
  @Auth(UserRoles.ADMINISTRATOR, UserRoles.SECURITY_PERSONNEL)
  @Csrf()
  findOne(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.studentsService.findOne(id, user);
  }

  @Get('guardian/:id')
  @Auth(UserRoles.ADMINISTRATOR, UserRoles.GUARDIAN)
  @Csrf()
  findAllByGuardian(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ) {
    return this.studentsService.findAllByGuardian(id, user);
  }

  @Patch(':id')
  @Auth(UserRoles.ADMINISTRATOR)
  @Csrf()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStudentDto: UpdateStudentDto,
    @GetUser() user: User,
  ) {
    return this.studentsService.update(id, updateStudentDto, user);
  }

  @Delete(':id')
  @Auth(UserRoles.ADMINISTRATOR)
  @Csrf()
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.studentsService.remove(id, user);
  }
}
