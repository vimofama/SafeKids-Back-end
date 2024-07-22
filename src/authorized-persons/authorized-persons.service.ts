import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthorizedPersonDto } from './dto/create-authorized-person.dto';
import { UpdateAuthorizedPersonDto } from './dto/update-authorized-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorizedPerson } from './entities/authorized-person.entity';
import { Repository } from 'typeorm';
import { Student } from 'src/students/entities/student.entity';
import { User } from 'src/users/entities/user.entity';
import { ActionLogsService } from 'src/action-logs/action-logs.service';

@Injectable()
export class AuthorizedPersonsService {
  private readonly logger = new Logger('AuthorizedPersonsService');

  constructor(
    @InjectRepository(AuthorizedPerson)
    private readonly authorizedPersonRepository: Repository<AuthorizedPerson>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly actionLogsService: ActionLogsService,
  ) {}

  async create(
    createAuthorizedPersonDto: CreateAuthorizedPersonDto,
    user: User,
  ) {
    const { studentId, ...authorizedPersonData } = createAuthorizedPersonDto;

    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new BadRequestException(`Student not found.`);
    }
    try {
      const authorizedPerson = this.authorizedPersonRepository.create({
        ...authorizedPersonData,
        student,
      });

      const savedAuthorizedPerson =
        await this.authorizedPersonRepository.save(authorizedPerson);
      await this.actionLogsService.create({
        user: user,
        timestamp: new Date(),
        action: `Create Authorized Person with id: ${savedAuthorizedPerson.id}.`,
      });

      return savedAuthorizedPerson;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(user: User) {
    await this.actionLogsService.create({
      user: user,
      timestamp: new Date(),
      action: 'Search all authorized persons.',
    });

    return await this.authorizedPersonRepository.find({
      relations: ['students'],
    });
  }

  async findOne(id: string, user: User) {
    const authorizedPerson = await this.authorizedPersonRepository.findOne({
      where: { id },
      relations: ['students'],
    });
    if (!authorizedPerson) {
      throw new NotFoundException(`Authorized person not found.`);
    }

    await this.actionLogsService.create({
      user: user,
      timestamp: new Date(),
      action: `Search authorized person with id ${id}.`,
    });

    return authorizedPerson;
  }

  async findAllByGuardian(id: string, user: User) {
    const authorizedPerson = await this.authorizedPersonRepository.find({
      where: { student: { guardian: { id } } },
      relations: ['students'],
    });
    if (!authorizedPerson) {
      throw new NotFoundException(`Authorized person not found.`);
    }

    await this.actionLogsService.create({
      user: user,
      timestamp: new Date(),
      action: `Search all authorized persons by guardian with id: ${id}.`,
    });

    return authorizedPerson;
  }

  async update(
    id: string,
    updateAuthorizedPersonDto: UpdateAuthorizedPersonDto,
    user: User,
  ) {
    const authorizedPerson = await this.authorizedPersonRepository.preload({
      id,
      ...updateAuthorizedPersonDto,
    });

    if (!authorizedPerson)
      throw new NotFoundException(`Authorized person not found.`);

    try {
      await this.authorizedPersonRepository.save(authorizedPerson);

      await this.actionLogsService.create({
        user: user,
        timestamp: new Date(),
        action: `Update authorized person with id: ${id}.`,
      });

      return authorizedPerson;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string, user: User) {
    const authorizedPerson = await this.findOne(id, user);
    try {
      await this.authorizedPersonRepository.remove(authorizedPerson);

      await this.actionLogsService.create({
        user: user,
        timestamp: new Date(),
        action: `Delete authorized person with id: ${id}.`,
      });
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected Error.');
  }
}
