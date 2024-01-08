import { 
  DataType, 
  Model, 
  Table, 
  Column 
} from 'sequelize-typescript';

interface ITaskCreationModel {
  title: string;
  description: string;
  status: string;
}

@Table({tableName: 'tasks'})
export class Task extends Model<Task, ITaskCreationModel> {
  @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
  taskId: number;

  @Column({type: DataType.STRING, allowNull: false})
  title: string;
    
  @Column({type: DataType.STRING, allowNull: false})
  description: string;

  @Column({type: DataType.STRING, allowNull: false})
  status: string;
}