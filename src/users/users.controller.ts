import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { Auth, GetUser } from './decorators';
import { UserRoles } from './entities/user-roles.enum';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
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

  @Post('check-auth-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.usersService.checkAuthStatus(user);
  }

  @Get(':term')
  @Auth()
  findOne(@Param('term') term: string) {
    return this.usersService.findById(term);
  }
}
