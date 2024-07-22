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
import { Repository } from 'typeorm';
import { PickUp } from './entities/pick-up.entity';
import { AuthorizedPerson } from 'src/authorized-persons/entities/authorized-person.entity';
import { User } from 'src/users/entities/user.entity';
import { ActionLogsService } from 'src/action-logs/action-logs.service';

@Injectable()
export class PickUpsService {
  private readonly logger = new Logger('PickUpsService');

  constructor(
    @InjectRepository(PickUp)
    private readonly pickUpRepository: Repository<PickUp>,
    @InjectRepository(AuthorizedPerson)
    private readonly authorizedPersonRepository: Repository<AuthorizedPerson>,
    private readonly actionLogsService: ActionLogsService,
  ) {}

  async create(createPickUpDto: CreatePickUpDto, user: User) {
    const { authorizedPersonId, ...pickUpData } = createPickUpDto;

    const authorizedPerson = await this.authorizedPersonRepository.findOne({
      where: { id: authorizedPersonId },
    });
    if (!authorizedPerson) {
      throw new BadRequestException(`Authorized person not found.`);
    }
    try {
      const pickUp = this.pickUpRepository.create({
        ...pickUpData,
        authorizedPerson,
      });

      const savedPickUp = await this.pickUpRepository.save(pickUp);
      await this.actionLogsService.create({
        user: user,
        timestamp: new Date(),
        action: `Create Pick Up with id: ${savedPickUp.id}.`,
      });

      return savedPickUp;
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
      relations: ['authorizedPerson', 'authorizedPerson.student'],
    });
  }

  async findOne(id: string, user: User) {
    const pickUp = await this.pickUpRepository.findOne({
      where: { id },
      relations: ['authorizedPerson', 'authorizedPerson.student'],
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

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected Error.');
  }
}
