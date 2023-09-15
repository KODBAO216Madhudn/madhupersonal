import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './task-status.enum';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid') //Automatically generated id for tasks
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  finishedBy: string;

  @Column()
  status: TaskStatus;
}
