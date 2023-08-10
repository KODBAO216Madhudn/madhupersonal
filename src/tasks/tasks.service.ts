import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { NotFoundException } from '@nestjs/common/exceptions';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilter(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    // define temporary array to hold the result
    let tasks = this.getAllTasks();

    // do something with status
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    // do something with search
    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });
    }

    // return final result
    return tasks;
  }

  getTasksById(id: string): Task {
    // try to get task
    // if not found, throw an error (404 not found)
    const found= this.tasks.find((tasks) => tasks.id === id);

    if(!found){
      // ....
      throw new NotFoundException(`Task with ID"${id}"not found`);
    }else{
      return found;
    }
  }

  deleteTasksById(id: string): Task[] {
    this.tasks = this.tasks.filter((tasks) => tasks.id !== id);
    return this.tasks;
  }

  createTasks(createTaskDto: CreateTaskDto): Task {
    const { title, description, finishedBy } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      finishedBy,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  updateTasks(id: string, status: TaskStatus) {
    const task = this.getTasksById(id);
    task.status = status;
    return task;

    return task;
  }
}
