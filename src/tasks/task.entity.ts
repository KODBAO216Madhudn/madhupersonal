import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/auth.entity';
import { Exclude } from 'class-transformer';

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

  @Exclude({toPlainOnly: true})
  @ManyToOne(_type => User, user=> user.tasks, {eager:false})
  user: User;

  // constructor(partial: Partial<User>) {
  //   Object.assign(this, partial);
  // }
}
