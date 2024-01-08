import { WebSocketGateway, 
    SubscribeMessage, 
    MessageBody, 
    WebSocketServer,
    ConnectedSocket, 
    OnGatewayConnection,
    OnGatewayDisconnect
} from "@nestjs/websockets";

import { Socket, Server } from 'socket.io'
import { TaskService } from "./task.service";
import { CreateTaskRequest } from "./dto/create.task.dto";

@WebSocketGateway({
    cors: true
})
export class TaskGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private taskService: TaskService) {}

    @WebSocketServer() server: Server;

    private connectedClients: Socket[] = [];

    handleConnection(client: Socket) {
        this.connectedClients.push(client)
    }

    handleDisconnect(client: Socket) {
        this.connectedClients.splice(this.connectedClients.indexOf(client), 1);
    }

    @SubscribeMessage('add-todo') 
    async handleAddTask(@ConnectedSocket() socket: Socket, @MessageBody() payload: CreateTaskRequest) {
        const createdTask =  await this.taskService.createTask(payload);
        const task = await this.taskService.getTaskById(createdTask.taskId);
        this.connectedClients.forEach(x => {x.emit('new-task', task)})
    }  

    @SubscribeMessage('remove-todo') 
    async handleDeleteTask(@ConnectedSocket() socket: Socket, @MessageBody() payload: { id: number }) {
        const deletedTask = await this.taskService.removeTask(payload.id);
        this.connectedClients.forEach(x => {x.emit('task-removed', deletedTask)})
    }  

    @SubscribeMessage('edit-todo') 
    async handleEditTask(@ConnectedSocket() socket: Socket, @MessageBody() payload: CreateTaskRequest) {
        const updatedTask = await this.taskService.editTask(payload);
        this.connectedClients.forEach(x => {x.emit('task-updated', updatedTask)})
    }  
}