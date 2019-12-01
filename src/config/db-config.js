import { DATA_BASE_KEY, LOCATION_DATA_BASE_KEY } from '../keys/keys';
import { SAP_CONTROL } from './app-config';
import { ENVIRONMENT } from '../constants/app-constants';

let SQL_CONFIG = {
  // 开发时配置
  [ENVIRONMENT.DEV]: {
    host: 'localhost',
    user: 'root',
    password: LOCATION_DATA_BASE_KEY,
    database: 'softwareTest',
    port: 3306,
    connectionLimit: 10
  },
  // 测试环境配置
  [ENVIRONMENT.TEST]: {
    host: 'localhost',
    user: 'root',
    password: LOCATION_DATA_BASE_KEY,
    database: 'softwareTest',
    port: 3306,
    connectionLimit: 10
  },
  // 生产环境
  [ENVIRONMENT.PRO]: {
    host: 'localhost',
    user: 'root',
    password: LOCATION_DATA_BASE_KEY,
    database: 'softwareTest',
    port: 3306,
    connectionLimit: 10
  }
};

export default SQL_CONFIG[SAP_CONTROL];
