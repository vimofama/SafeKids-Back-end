import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { ActionLogsService } from 'src/action-logs/action-logs.service';
import { UserRoles } from '../users/entities/user-roles.enum';
import { validate as isUUID } from 'uuid';

@Injectable()
export class StudentsService {
  private readonly logger = new Logger('StudentsService');

  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly actionLogsService: ActionLogsService,
  ) {}

  async create(createStudentDto: CreateStudentDto, user: User) {
    const { guardianId, ...studentData } = createStudentDto;

    const guardian = await this.userRepository.findOne({
      where: { id: guardianId },
    });
    if (!guardian) {
      // Register action log
      await this.actionLogsService.create({
        userId: user.id,
        timestamp: new Date(),
        action: `${HttpStatus.BAD_REQUEST} Error. Guardian not found when trying to create student.`,
      });
      throw new BadRequestException(`Guardian not found.`);
    }

    if (guardian.userRole !== UserRoles.GUARDIAN) {
      await this.actionLogsService.create({
        userId: user.id,
        timestamp: new Date(),
        action: `${HttpStatus.BAD_REQUEST} Error. User is not a guardian when trying to create student.`,
      });
      throw new BadRequestException(`User is not a guardian.`);
    }
    try {
      const student = this.studentRepository.create({
        ...studentData,
        guardian,
      });

      const savedStudent = await this.studentRepository.save(student);

      // Register action log
      await this.actionLogsService.create({
        userId: user.id,
        timestamp: new Date(),
        action: `Create Student with id: ${savedStudent.id}.`,
      });

      return savedStudent;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(user: User) {
    // Register action log
    await this.actionLogsService.create({
      userId: user.id,
      timestamp: new Date(),
      action: 'Search all students.',
    });

    return await this.studentRepository.find();
  }

  async findOne(term: string, user: User) {
    let student: Student;

    if (isUUID(term)) {
      student = await this.studentRepository.findOne({
        where: { id: term },
      });
    } else {
      student = await this.studentRepository.findOne({
        where: { ci: term },
      });
    }

    if (!student) {
      await this.actionLogsService.create({
        userId: user.id,
        timestamp: new Date(),
        action: `${HttpStatus.NOT_FOUND} Error. Student with id: ${term} not found.`,
      });
      throw new NotFoundException(`Student not found.`);
    }

    // Register action log
    await this.actionLogsService.create({
      userId: user.id,
      timestamp: new Date(),
      action: `Search student with id ${student.id}.`,
    });

    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto, user: User) {
    const student = await this.studentRepository.preload({
      id,
      ...updateStudentDto,
    });

    if (!student) {
      await this.actionLogsService.create({
        userId: user.id,
        timestamp: new Date(),
        action: `${HttpStatus.NOT_FOUND} Error. Student with id: ${id} not found when trying to update.`,
      });
      throw new NotFoundException(`Student not found.`);
    }

    try {
      await this.studentRepository.save(student);

      // Register action log
      await this.actionLogsService.create({
        userId: user.id,
        timestamp: new Date(),
        action: `Update student with id: ${id}.`,
      });

      return student;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected Error.');
  }
}
