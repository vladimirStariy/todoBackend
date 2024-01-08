import { TaskController } from "./task.controller";
import { TaskGateway } from "./task.gate";
import { Task } from "./task.model";
import { TaskService } from "./task.service";
import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";

@Module({
    controllers: [TaskController],
    providers: [TaskService, TaskGateway],
    imports: [
      SequelizeModule.forFeature([Task]),
    ],
    exports: [
      TaskService
    ]
  })
  
  export class TaskModule {}