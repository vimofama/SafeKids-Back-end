import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayLoad } from './interfaces/jwt-payload.interface';
import { CreateUserDto, LoginUserDto } from './dto';
import { ActionLogsService } from 'src/action-logs/action-logs.service';
import { RoleExpiryTimes, UserRoles } from './entities/user-roles.enum';
import { validate as isUUID } from 'uuid';

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

      // Register action log
      await this.actionLogsService.create({
        timestamp: new Date(),
        action: `User created with id: ${user.id}.`,
      });

      delete user.password;

      return {
        ...user,
        jwt: this.getJwtToken({ id: user.id }, user.userRole),
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  /**
   * Generates a JWT token with the given payload and user role
   * @param payload Payload to be signed
   * @param userRole User role to get the token expiry time
   * @returns JWT token
   */
  private getJwtToken(payload: JwtPayLoad, userRole: UserRoles) {
    const expiresIn = this.getTokenExpiryTime(userRole);
    const token = this.jwtService.sign(payload, { expiresIn });
    return token;
  }

  /**
   * Gets the token expiry time for the given role
   * @param role Role to get the token expiry time
   * @returns Token expiry time
   */
  private getTokenExpiryTime(role: UserRoles): string {
    return RoleExpiryTimes[role] || '1h';
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      // Register action log
      await this.actionLogsService.create({
        timestamp: new Date(),
        action: `User with email: ${email} tried to log in.`,
      });

      throw new UnauthorizedException('Credentals are not valid.');
    }

    // Register action log
    await this.actionLogsService.create({
      userId: user.id,
      timestamp: new Date(),
      action: `User with id: ${user.id} logged in.`,
    });
    return { ...user, jwt: this.getJwtToken({ id: user.id }, user.userRole) };
  }

  async findAll(user: User) {
    const users = await this.userRepository.find({ relations: ['students'] });

    // Register action log
    await this.actionLogsService.create({
      userId: user.id,
      timestamp: new Date(),
      action: 'Search of all users.',
    });

    return users;
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error.');
  }

  async findById(term: string, user: User) {
    let userSearched: User;

    if (isUUID(term)) {
      userSearched = await this.userRepository.findOne({
        where: { id: term },
        relations: ['students'],
      });
    } else {
      userSearched = await this.userRepository.findOne({
        where: { ci: term },
        relations: ['students'],
      });
    }

    if (!userSearched) {
      // Register action log
      await this.actionLogsService.create({
        userId: user.id,
        timestamp: new Date(),
        action: `${HttpStatus.NOT_FOUND} Error. User with id: ${term} not found.`,
      });
      throw new NotFoundException('User not found.');
    }

    // Register action log
    await this.actionLogsService.create({
      userId: user.id,
      timestamp: new Date(),
      action: `Search of user with id: ${userSearched.id}`,
    });

    return userSearched;
  }
}
