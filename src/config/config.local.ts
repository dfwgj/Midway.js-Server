import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '、',

  koa: {
    port: 7001, // 设置 Koa 服务器的端口
  },

  // 服务器配置
  serverConfig: {
    host: '', // 服务器主机地址
    port: , // 服务器端口
    baseUrl: '', // API 路由的基本路径
  },

  // 数据库配置，改成 databaseConfig
  databaseConfig: {
    host: '', // 数据库主机地址
    port: , // 数据库端口
    user: '', // 数据库用户名
    password: '', // 数据库密码
    database: '', // 数据库名称
  },
  // 缓存配置
  redis: {
    client: {
      port: , // Redis 端口
      host: "", // Redis 主机地址
      password: "",
      db: 0,
    },
  },
  // 缓存配置，使用 Redis 作为缓存存储
  cacheManager: {
    clients: {
      redis: {
        store: 'redis',  // 使用 Redis 存储
        options: {
          host: '',
          port: ,
          password: '',
          db: ,
          ttl: 100,
          max: 1000,
        },
      }
    }
  },
  jwtConfig: {
    secret: '',
    expiresIn: '12h',
  },
} as MidwayConfig;
