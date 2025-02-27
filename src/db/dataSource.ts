import { Task } from 'src/tasks/task.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
export const dataConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'tasks',
  migrations: ['dist/migrations/*.js'],
  entities: [Task],
};
export const appDataSource = new DataSource(dataConfig);
