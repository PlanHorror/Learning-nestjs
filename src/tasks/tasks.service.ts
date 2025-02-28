import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/createTask.dto';
import { FilterTaskDto } from './dto/filterAndSearchTask.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async getAllTask(filterTask: FilterTaskDto): Promise<Task[]> {
    const { search, status } = filterTask || {};
    const queryTask = this.taskRepository.createQueryBuilder('task');

    if (status) {
      queryTask.andWhere('task.status = :status', { status });
    }
    if (search) {
      queryTask.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );
    }
    return await queryTask.getMany();
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.taskRepository.findOneBy({ id });
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  async createTask(createTaskDtd: CreateTaskDto, user: User): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDtd,
      status: TaskStatus.OPEN,
      user,
    });
    await this.taskRepository.save(task);
    return task;
  }

  async deleteTask(id: string): Promise<object> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Not found task ${id}`);
    }
    return {
      message: 'Delete success',
    };
  }

  async updateStatusTask(id: string, status: TaskStatus): Promise<Task> {
    const result = await this.getTaskById(id);
    result.status = status;
    await this.taskRepository.save(result);
    return result;
  }

  // getAllTasks() {
  //   return this.tasks;
  // }
  // getTaskByFilter(queryTask: FilterTask): Task[] {
  //   let tasks = this.getAllTasks();
  //   tasks = queryTask.status
  //     ? this.tasks.filter((task) => task.status == queryTask.status)
  //     : tasks;
  //   if (queryTask.search) {
  //     tasks = tasks.filter((task) => {
  //       return (
  //         task.description.includes(queryTask.search!) ||
  //         task.title.includes(queryTask.search!)
  //       );
  //     });
  //   }
  //   if (!tasks.length) {
  //     throw new NotFoundException('No tasks avaible');
  //   }
  //   return tasks;
  // }
  // getTaskById(id: string): Task {
  //   const found = this.tasks.find((task) => task.id === id);
  //   if (!found) {
  //     throw new NotFoundException();
  //   }
  //   return found;
  // }
  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;
  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.tasks.push(task);
  //   return task;
  // }
  // deleteTask(id: string): void {
  //   this.getTaskById(id);
  //   this.tasks = this.tasks.filter((e) => e.id !== id);
  // }
  // updateTaskStatus(id: string, status: TaskStatus): Task {
  //   this.getTaskById(id).status = status;
  //   return this.getTaskById(id);
  // }
}
