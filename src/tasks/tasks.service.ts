import { Injectable } from '@nestjs/common';
// import { TaskStatus } from './task-status.enum';
// // import { v4 as uuid } from 'uuid';
// import { CreateTaskDto } from './dto/create-task.dto';
// import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/auth.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class TasksService {
  private logger=new Logger('TasksService');

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}
  // private tasks: Task[] = [];

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: {
        id,
        user,
      },
    });

    this.logger.verbose(JSON.stringify(found));
    if (!found) { 
      throw new NotFoundException(`Task with ID"${id}" not found`);
    }

    return found;
  }

  // async getAllTasks(filterDto : GetTasksFilterDto): Promise<Task[]> {
  //   const found = this.taskRepository.createQueryBuilder('task');
  //   const tasks = await found.getMany();

  //   return tasks;
  // }
  async getAllTasks(filterDto : GetTasksFilterDto, user: User): Promise<Task[]> {
    const {search, status}  = filterDto;

    try{

      const query = this.taskRepository.createQueryBuilder('task');
      
      query.where({user});
      if(status){
        query.andWhere('task.status = :status', {status})
      }
      if(search){
        query.andWhere('(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search :`%${search}%`,
      })
    }
    
    const tasks = await query.getMany();
    return tasks;
  }catch(error){
    error.stack;
  }
  }

  async createTasks(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description, finishedBy } = createTaskDto;

    const task = this.taskRepository.create({
      title,
      description,
      finishedBy,
      status: TaskStatus.OPEN,
      user,
    });

    const saveTask= await this.taskRepository.save(task);

    return saveTask;
  }

    async deleteTasksById(id: string, user: User): Promise<void> {

      try{
        const tasks=await this.getTaskById(id, user);

        if(tasks){

          const task = await this.taskRepository.delete(id);
          if( task.affected === 0){
            throw new NotFoundException(`"Task ",${id},"Not Exist"`);
          }
        }
      }catch(error){
        error.stack;
      }

  }

  async updateTasks(id:string, status:TaskStatus, user: User):Promise<Task>{

    try{

      const tasks=await this.getTaskById(id, user);
      
      tasks.status = status;
      
      await this.taskRepository.save(tasks);
      return tasks;
    }catch(error){
      error.stack;
    }
  }

  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  // getTasksWithFilter(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   // define temporary array to hold the result
  //   let tasks = this.getAllTasks();
  //   // do something with status
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //   // do something with search
  //   if (search) {
  //     tasks = tasks.filter((task) => {
  //       if (task.title.includes(search) || task.description.includes(search)) {
  //         return true;
  //       }
  //       return false;
  //     });
  //   }
  //   // return final result
  //   return tasks;
  // }
  // getTasksById(id: string): Task {
  //   // try to get task
  //   // if not found, throw an error (404 not found)
  //   const found= this.tasks.find((tasks) => tasks.id === id);
  //   if(!found){
  //     // ....
  //     throw new NotFoundException(`Task with ID"${id}"not found`);
  //   }else{
  //     return found;
  //   }
  // }
  // deleteTasksById(id: string): Task[] {
  //   const task = this.getTasksById(id);
  //   this.tasks = this.tasks.filter((tasks) => task.id !== tasks.id);
  //   return this.tasks;
  // }
  // createTasks(createTaskDto: CreateTaskDto): Task {
  //   const { title, description, finishedBy } = createTaskDto;
  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     finishedBy,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.tasks.push(task);
  //   return task;
  // }
  // updateTasks(id: string, status: TaskStatus) {
  //   const task = this.getTasksById(id);
  //   task.status = status;
  //   return task;
  //   return task;
  // }
}
