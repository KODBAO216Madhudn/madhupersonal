import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  // @Get()
  // getAllTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
  //   return this.tasksService.getAllTasks(filterDto);
  // }
  @Get()
  getAllTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksService.getAllTasks(filterDto);
  }
  
  // @Get()
  // getAllTasks(): Task[] {
  //   return this.tasksService.getAllTasks();
  // }

  // @Get()
  // getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
  //   // if we have any filters defined, call tasksService.getTasksWilFilters
  //   // otherwise, just get all tasks
  //   if (Object.keys(filterDto).length) {
  //     // ...
  //     return this.tasksService.getTasksWithFilter(filterDto);
  //   } else {
  //     return this.tasksService.getAllTasks();
  //   }
  // }

  // @Get('/:id')
  // getTasksById(@Param('id') id: string): Task {
  //   return this.tasksService.getTasksById(id);
  // }

  @Delete('/:id')
  deleteTasksById(@Param('id') id: string): Promise<void> {
    return this.tasksService.deleteTasksById(id);
  }

  @Post()
  createTask(
    // @Body('title') title: string,
    // @Body('description') description: string,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    return this.tasksService.createTasks(createTaskDto);
  }

  @Patch('/:id/status')
  updateTask(
    // @Body('title') title: string,
    // @Body('description') description: string,
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTasks(id, status);
  }
}
