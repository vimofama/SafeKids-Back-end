import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayLoad } from './interfaces/jwt-payload.interface';
import { CreateUserDto, LoginUserDto } from './dto';
import * as userRolesEnum from './entities/user-roles.enum';
import { ActionLogsService } from 'src/action-logs/action-logs.service';
import { RoleExpiryTimes, UserRoles } from './entities/user-roles.enum';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly actionLogsService: ActionLogsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);

      await this.actionLogsService.create({
        timestamp: new Date(),
        action: `User created with id: ${user.id}.`,
      });

      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id }, user.userRole),
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private getJwtToken(payload: JwtPayLoad, userRole: UserRoles) {
    const expiresIn = this.getTokenExpiryTime(userRole);
    const token = this.jwtService.sign(payload, { expiresIn });
    return token;
  }

  private getTokenExpiryTime(role: UserRoles): string {
    return RoleExpiryTimes[role] || '1h';
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      await this.actionLogsService.create({
        timestamp: new Date(),
        action: `User with email: ${email} tried to log in.`,
      });

      throw new UnauthorizedException('Credentals are not valid.');
    }

    await this.actionLogsService.create({
      timestamp: new Date(),
      action: `User with id: ${user.id} logged in.`,
    });
    return { ...user, token: this.getJwtToken({ id: user.id }, user.userRole) };
  }

  async findAll(user: User) {
    const users = await this.userRepository.find({ relations: ['students'] });

    await this.actionLogsService.create({
      user: user,
      timestamp: new Date(),
      action: 'Search of all users.',
    });

    return users;
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error.');
  }

  checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }, user.userRole),
    };
  }
}
