import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateActionLogDto } from './dto/create-action-log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ActionLog } from './entities/action-log.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ActionLogsService {
  private readonly logger = new Logger('ActionLogsService');

  constructor(
    @InjectRepository(ActionLog)
    private readonly actionLogRepository: Repository<ActionLog>,
  ) {}

  async create(createActionLogDto: CreateActionLogDto) {
    try {
      const actionLog = this.actionLogRepository.create(createActionLogDto);

      return await this.actionLogRepository.save(actionLog);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    return await this.actionLogRepository.find({ relations: ['user'] });
  }

  private handleDBExceptions(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected Error.');
  }
}
