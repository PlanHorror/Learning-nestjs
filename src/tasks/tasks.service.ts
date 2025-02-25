import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/createTask.dto';
import { FilterTask } from './dto/filterAndSearchTask.dto';
@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks() {
    return this.tasks;
  }

  getTaskByFilter(queryTask: FilterTask): Task[] {
    let tasks = this.getAllTasks();
    tasks = queryTask.status
      ? this.tasks.filter((task) => task.status == queryTask.status)
      : tasks;
    if (queryTask.search) {
      tasks = tasks.filter((task) => {
        return (
          task.description.includes(queryTask.search!) ||
          task.title.includes(queryTask.search!)
        );
      });
    }
    return tasks;
  }

  getTaskById(id: string): Task {
    return this.tasks.find((task) => task.id === id)!;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter((e) => e.id !== id);
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    this.getTaskById(id).status = status;
    return this.getTaskById(id);
  }
}
