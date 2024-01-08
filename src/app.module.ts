import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './task/task.model';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      dialectOptions: {
        ssl: true
      },
      host: process.env.PGSQL_HOST,
      port: Number(process.env.PGSQL_PORT),
      database: process.env.PGSQL_DB,
      username: process.env.PGSQL_USER,
      password: process.env.PGSQL_PASSWORD,
      models: [
        Task
      ],
      autoLoadModels: true
    }),
    TaskModule
  ],
  controllers: [],
  providers: [TaskModule],
})
export class AppModule {}
