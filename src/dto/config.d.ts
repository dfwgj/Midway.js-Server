import { MidwayConfig } from '@midwayjs/core';

export interface DBConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

// 扩展 MidwayConfig 类型，增加 databaseConfig
export interface Config extends MidwayConfig {
  databaseConfig: DBConfig;
}
