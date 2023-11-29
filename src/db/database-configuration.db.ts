import {
  DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from '../core/constants/environment-variable.constants';
import { DataSource, DataSourceOptions } from 'typeorm';

export const DataBaseConfiguration: DataSourceOptions = {
  type: 'mysql',
  username: DB_USER,
  password: DB_PASSWORD,
  database: DATABASE,
  port: parseInt(DB_PORT),
  host: DB_HOST,
  entities: [__dirname + '../../**/*.entity{.ts,.js}'],
  synchronize: true,
  cache: true,
};

const dataSource = new DataSource(DataBaseConfiguration);
export default dataSource;
