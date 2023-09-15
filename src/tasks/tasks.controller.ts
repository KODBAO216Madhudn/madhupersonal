import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import {AuthGuard} from "@nestjs/passport"
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/auth.entity';
import { ConfigModule } from '@nestjs/config';


@Controller('tasks')
@UseGuards(AuthGuard())
// @UseInterceptors(ClassSerializerInterceptor)
export class TasksController {
  constructor(private tasksService: TasksService,
    private configModule: ConfigModule) {
      
    }

  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User,): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Get()
  getAllTasks(@Query() filterDto: GetTasksFilterDto, @GetUser() user: User,): Promise<Task[]> {
    return this.tasksService.getAllTasks(filterDto, user);
  }
  
  @Delete('/:id')
  deleteTasksById(@Param('id') id: string, @GetUser() user: User,): Promise<void> {
    return this.tasksService.deleteTasksById(id, user);
  }

  @Post()
  createTask(
    // @Body('title') title: string,
    // @Body('description') description: string,
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTasks(createTaskDto, user);
  }

  @Patch('/:id')
  updateTask(
    // @Body('title') title: string,
    // @Body('description') description: string,
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTasks(id, status, user);
  }
}
