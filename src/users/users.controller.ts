import { Controller, Get, Post, Body, Req, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { Auth, GetUser } from './decorators';
import { UserRoles } from './entities/user-roles.enum';
import { User } from './entities/user.entity';
import { Csrf } from 'ncsrf';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @Auth(UserRoles.ADMINISTRATOR)
  @Csrf()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Get()
  @Auth(UserRoles.ADMINISTRATOR)
  findAll(@GetUser() user: User) {
    return this.usersService.findAll(user);
  }

  @Get('/token-csrf')
  @Auth()
  getCsrfToken(@Req() req) {
    return {
      csrfToken: req.csrfToken(),
    };
  }

  @Get(':term')
  @Auth()
  findOne(@Param('term') term: string, @GetUser() user: User) {
    return this.usersService.findById(term, user);
  }
}
