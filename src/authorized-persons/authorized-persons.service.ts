import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthorizedPersonDto } from './dto/create-authorized-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorizedPerson } from './entities/authorized-person.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { ActionLogsService } from 'src/action-logs/action-logs.service';
import { validate as isUUID } from 'uuid';

@Injectable()
export class AuthorizedPersonsService {
  private readonly logger = new Logger('AuthorizedPersonsService');

  constructor(
    @InjectRepository(AuthorizedPerson)
    private readonly authorizedPersonRepository: Repository<AuthorizedPerson>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly actionLogsService: ActionLogsService,
  ) {}

  async create(
    createAuthorizedPersonDto: CreateAuthorizedPersonDto,
    user: User,
  ) {
    const { guardianId, ...authorizedPersonData } = createAuthorizedPersonDto;

    const guardian = await this.userRepository.findOne({
      where: { id: guardianId },
    });
    if (!guardian) {
      await this.actionLogsService.create({
        userId: user.id,
        timestamp: new Date(),
        action: `${HttpStatus.BAD_REQUEST} Error. Guardian not found when trying to create authorized person.`,
      });
      throw new BadRequestException(`Guardian not found.`);
    }
    try {
      const authorizedPerson = this.authorizedPersonRepository.create({
        ...authorizedPersonData,
        guardian,
      });

      const savedAuthorizedPerson =
        await this.authorizedPersonRepository.save(authorizedPerson);
      // Register action log
      await this.actionLogsService.create({
        userId: user.id,
        timestamp: new Date(),
        action: `Create Authorized Person with id: ${savedAuthorizedPerson.id}.`,
      });

      return savedAuthorizedPerson;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(term: string, user: User) {
    let authorizedPerson: AuthorizedPerson;

    if (isUUID(term)) {
      authorizedPerson = await this.authorizedPersonRepository.findOne({
        where: { id: term },
      });
    } else {
      authorizedPerson = await this.authorizedPersonRepository.findOne({
        where: { ci: term },
      });
    }

    if (!authorizedPerson) {
      await this.actionLogsService.create({
        userId: user.id,
        timestamp: new Date(),
        action: `${HttpStatus.NOT_FOUND} Error. Authorized person with id: ${term} not found.`,
      });
      throw new NotFoundException(`Authorized person not found.`);
    }

    // Register action log
    await this.actionLogsService.create({
      userId: user.id,
      timestamp: new Date(),
      action: `Search authorized person with id ${term}.`,
    });

    return authorizedPerson;
  }

  async findAllByGuardian(id: string, user: User) {
    const authorizedPersons = await this.authorizedPersonRepository.find({
      where: { guardian: { id } },
    });
    if (!authorizedPersons) {
      await this.actionLogsService.create({
        userId: user.id,
        timestamp: new Date(),
        action: `${HttpStatus.NOT_FOUND} Error. Authorized persons not found when trying to search by guardian with id: ${id}.`,
      });
      throw new NotFoundException(`Authorized persons not found.`);
    }

    // Register action log
    await this.actionLogsService.create({
      userId: user.id,
      timestamp: new Date(),
      action: `Search all authorized persons by guardian with id: ${id}.`,
    });

    return authorizedPersons;
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected Error.');
  }
}
