import { HttpException, 
    HttpStatus, 
    Injectable, 
    Logger, 
    UnauthorizedException,
    NotFoundException,
    ConflictException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './task.model';
import { CreateTaskRequest } from './dto/create.task.dto';
import { TaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {
    constructor(@InjectModel(Task) private taskRepository: typeof Task) {}

    async createTask(dto: CreateTaskRequest) {
        const created = await this.taskRepository.create({
            title: dto.title,
            description: dto.description,
            status: dto.status
        })
        return created;
    }

    async editTask(dto: CreateTaskRequest) {
        const task = await this.taskRepository.findOne({where: {taskId: dto.taskId}});
        task.title = dto.title;
        task.description = dto.description;
        task.status = dto.status;
        await task.save();
        return task;
    }

    async removeTask(id: number) {
        const task = await this.taskRepository.findOne({where: {taskId: id}});
        const deletedTask = { 
            taskId: task.taskId,
            title: task.title, 
            description: task.description, 
            status: task.status 
        }
        await task.destroy();
        return deletedTask;
    }

    async getTaskById(id: number) {
        const task = await this.taskRepository.findOne({where: {taskId: id}});
        return { 
            taskId: task.taskId, 
            title: task.title, 
            description: task.description, 
            status: task.status
        }
    }

    async getTasks() {
        const tasks = await this.taskRepository.findAll();
        const sorted = tasks.sort((a: Task, b: Task) => {
            return b.createdAt.getTime() - a.createdAt.getTime();
        })
        const taskDto: TaskDto[] = sorted.map((item) => {
            return { 
                taskId: item.taskId, 
                title: item.title,
                description: item.description,
                status: item.status
            }
        })
        return taskDto;
    }
}