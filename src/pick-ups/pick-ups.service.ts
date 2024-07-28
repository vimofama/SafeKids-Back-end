import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreatePickUpDto } from './dto/create-pick-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { PickUp } from './entities/pick-up.entity';
import { AuthorizedPerson } from 'src/authorized-persons/entities/authorized-person.entity';
import { User } from 'src/users/entities/user.entity';
import { ActionLogsService } from 'src/action-logs/action-logs.service';
import { Student } from 'src/students/entities/student.entity';

@Injectable()
export class PickUpsService {
  private readonly logger = new Logger('PickUpsService');

  constructor(
    @InjectRepository(PickUp)
    private readonly pickUpRepository: Repository<PickUp>,
    @InjectRepository(AuthorizedPerson)
    private readonly authorizedPersonRepository: Repository<AuthorizedPerson>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly actionLogsService: ActionLogsService,
  ) {}

  async create(createPickUpDto: CreatePickUpDto, user: User) {
    const { authorizedPersonId, studentId, ...pickUpData } = createPickUpDto;

    const authorizedPerson = await this.authorizedPersonRepository.findOne({
      where: { id: authorizedPersonId },
    });
    if (!authorizedPerson) {
      await this.actionLogsService.create({
        userId: user.id,
        timestamp: new Date(),
        action: `${HttpStatus.BAD_REQUEST} Error. Authorized person not found when trying to create pick up.`,
      });
      throw new BadRequestException(`Authorized person not found.`);
    }

    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      await this.actionLogsService.create({
        userId: user.id,
        timestamp: new Date(),
        action: `${HttpStatus.BAD_REQUEST} Error. Student not found when trying to create pick up.`,
      });
      throw new BadRequestException(`Student person not found.`);
    }

    if (student.guardian.id !== authorizedPerson.guardian.id) {
      await this.actionLogsService.create({
        userId: user.id,
        timestamp: new Date(),
        action: `${HttpStatus.BAD_REQUEST} Error. The student and authorized person must have the same guardian.`,
      });
      throw new BadRequestException(
        `The student and authorized person must have the same guardian.`,
      );
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const existingPickUp = await this.pickUpRepository.findOne({
      where: {
        student,
        timestamp: Between(startOfToday, endOfToday),
      },
    });

    try {
      if (existingPickUp) {
        existingPickUp.isPickedUp = true;
        existingPickUp.authorizedPerson = authorizedPerson;
        existingPickUp.timestamp = pickUpData.timestamp;
        await this.pickUpRepository.save(existingPickUp);

        // Register action log
        await this.actionLogsService.create({
          userId: user.id,
          timestamp: new Date(),
          action: `Updated Pick Up with id: ${existingPickUp.id} to isPickedUp: true and set authorizedPerson to ${authorizedPerson.id}.`,
        });
        return existingPickUp;
      } else {
        const pickUp = this.pickUpRepository.create({
          ...pickUpData,
          authorizedPerson,
          student,
          isPickedUp: true,
        });

        const savedPickUp = await this.pickUpRepository.save(pickUp);

        // Register action log
        await this.actionLogsService.create({
          userId: user.id,
          timestamp: new Date(),
          action: `Created Pick Up with id: ${savedPickUp.id}.`,
        });

        return savedPickUp;
      }
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(user: User) {
    // Register action log
    await this.actionLogsService.create({
      userId: user.id,
      timestamp: new Date(),
      action: 'Search all pick ups.',
    });

    return await this.pickUpRepository.find({
      relations: ['authorizedPerson', 'student'],
    });
  }

  async getTodaysPickUps(user: User) {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    let todaysPickUps = await this.pickUpRepository.find({
      where: {
        timestamp: Between(startOfToday, endOfToday),
      },
      relations: ['authorizedPerson', 'student'],
    });

    if (todaysPickUps.length === 0) {
      const students = await this.studentRepository.find();

      const newPickUps = students.map((student) => {
        const pickUp = this.pickUpRepository.create({
          timestamp: new Date(),
          authorizedPerson: null,
          student,
          isPickedUp: false,
        });
        return pickUp;
      });

      todaysPickUps = await this.pickUpRepository.save(newPickUps);
    }

    // Register action log
    await this.actionLogsService.create({
      userId: user.id,
      timestamp: new Date(),
      action: "Retrieve and/or create today's pick-ups.",
    });

    return todaysPickUps;
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected Error.');
  }
}
