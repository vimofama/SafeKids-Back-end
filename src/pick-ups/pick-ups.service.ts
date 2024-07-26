import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePickUpDto } from './dto/create-pick-up.dto';
import { UpdatePickUpDto } from './dto/update-pick-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
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
      throw new BadRequestException(`Authorized person not found.`);
    }

    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new BadRequestException(`Student person not found.`);
    }

    if (student.guardian.id !== authorizedPerson.guardian.id) {
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
        await this.pickUpRepository.save(existingPickUp);
        await this.actionLogsService.create({
          user: user,
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
        await this.actionLogsService.create({
          user: user,
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
    await this.actionLogsService.create({
      user: user,
      timestamp: new Date(),
      action: 'Search all pick ups.',
    });

    return await this.pickUpRepository.find({
      relations: ['authorizedPerson', 'student'],
    });
  }

  async findOne(id: string, user: User) {
    const pickUp = await this.pickUpRepository.findOne({
      where: { id },
      relations: ['authorizedPerson', 'student'],
    });
    if (!pickUp) {
      throw new NotFoundException(`Pick up not found.`);
    }

    await this.actionLogsService.create({
      user: user,
      timestamp: new Date(),
      action: `Search pick up with id: ${id}.`,
    });

    return pickUp;
  }

  async update(id: string, updatePickUpDto: UpdatePickUpDto, user: User) {
    const pickUp = await this.pickUpRepository.preload({
      id,
      ...updatePickUpDto,
    });

    if (!pickUp) throw new NotFoundException(`Pick up not found.`);

    try {
      await this.pickUpRepository.save(pickUp);

      await this.actionLogsService.create({
        user: user,
        timestamp: new Date(),
        action: `Update pick up with id: ${id}.`,
      });

      return pickUp;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string, user: User) {
    const pickUp = await this.findOne(id, user);
    try {
      await this.pickUpRepository.remove(pickUp);

      await this.actionLogsService.create({
        user: user,
        timestamp: new Date(),
        action: `Delete pick up with id: ${id}.`,
      });
    } catch (error) {
      this.handleDBExceptions(error);
    }
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
          timestamp: null,
          authorizedPerson: null,
          student,
          isPickedUp: false,
        });
        return pickUp;
      });

      todaysPickUps = await this.pickUpRepository.save(newPickUps);
    }

    await this.actionLogsService.create({
      user: user,
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
