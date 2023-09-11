import {EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

  async getAllTasks(filterDto : GetTasksFilterDto): Promise<Task[]> {
    const {status, search } = filterDto;

    const query = this.createQueryBuilder('task');

    if(status){
      query.andWhere('task.status = :status', {status})
    }
    if(search){

    }

    const tasks = await query.getMany();
    return tasks;
  }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description, finishedBy } = createTaskDto;
        const task = this.create({
          title,
          description,
          status: TaskStatus.OPEN,
        });
        await this.save(task);
        return task;
      }
}
