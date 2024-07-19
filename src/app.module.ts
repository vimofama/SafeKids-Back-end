import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { PickUpsModule } from './pick-ups/pick-ups.module';
import { AuthorizedPersonsModule } from './authorized-persons/authorized-persons.module';
import { LogsModule } from './logs/logs.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ssl:
        process.env.NODE_ENV === 'prod' || process.env.IS_REMOTE_DEV === 'true',
      extra: {
        ssl:
          process.env.NODE_ENV === 'prod' ||
          process.env.IS_REMOTE_DEV === 'true'
            ? { rejectUnathorized: false }
            : null,
      },
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
    }),
    UsersModule,
    StudentsModule,
    PickUpsModule,
    AuthorizedPersonsModule,
    LogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
