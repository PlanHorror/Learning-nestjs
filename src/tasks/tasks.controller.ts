import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/createTask.dto';
import { FilterTaskDto } from './dto/filterAndSearchTask.dto';
import { updateTaskStatus } from './dto/updateTaskStatus.dto';
import { Task } from './task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  async getAllTask(@Query() filterTask: FilterTaskDto): Promise<Task[]> {
    return await this.taskService.getAllTask(filterTask);
  }

  @Get('/:id')
  async getTask(@Param('id') id: string): Promise<Task> {
    return await this.taskService.getTaskById(id);
  }

  @Post()
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskService.createTask(createTaskDto);
  }

  @Delete('/:id')
  async deleteTask(@Param('id') id: string): Promise<object> {
    return await this.taskService.deleteTask(id);
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body() status: updateTaskStatus,
  ): Promise<Task> {
    const thisStatus = status.status;
    return this.taskService.updateStatusTask(id, thisStatus);
  }
  // @Get()
  // getAllTasks(@Query() queryTask: FilterTask): Task[] {
  //   return Object.keys(FilterTask)
  //     ? this.taskService.getTaskByFilter(queryTask)
  //     : this.taskService.getAllTasks();
  // }
  // @Post()
  // createTask(@Body() CreateTaskDto: CreateTaskDto): Task {
  //   return this.taskService.createTask(CreateTaskDto);
  // }
  // @Get('/:id')
  // getTaskById(@Param('id') id: string): Task {
  //   return this.taskService.getTaskById(id);
  // }
  // @Delete(':id')
  // deleteTaskById(@Param('id') id: string) {
  //   return this.taskService.deleteTask(id);
  // }
  // @Patch('/:id/status')
  // updateTaskStatus(
  //   @Param('id') id: string,
  //   @Body() status: updateTaskStatus,
  // ): Task {
  //   const validateStatus = status.status;
  //   return this.taskService.updateTaskStatus(id, validateStatus);
  // }
}
