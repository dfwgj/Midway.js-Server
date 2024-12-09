import { MidwayConfig } from '@midwayjs/core';
import { createRedisStore } from '@midwayjs/cache-manager';


export default {
  // 用于Cookie标志密钥，应更改为自己的密钥并确保其安全性。
  keys: '',
  koa: {
    port: 7001, // 设置 Koa 服务器的端口
    hostname: '127.0.0.1', // 设置 Koa 服务器的主机名
    globalPrefix: 'api', // 设置全局路由前缀，默认为 api
  },
  // 数据库配置，改成 databaseConfig
  databaseConfig: {
    host: '', // 数据库主机地址
    port: , // 数据库端口
    user: '', // 数据库用户名
    password: '', // 数据库密码
    database: '', // 数据库名称
  },
  // 缓存配置，使用 Redis 作为缓存存储
  cacheManager: {
    clients: {
      default: {
        store: createRedisStore('redis'), // 使用 createRedisStore 方法创建 Redis 存储
        options: {
          ttl: 43200000, // 设置缓存的过期时间为 12 小时
          refreshThreshold: 21600000, // 设置刷新阈值为 6 小时
        },
      },
    },
  },
  redis: {
    clients: {
      default: { // 定义 Redis 客户端实例
        port: ,
        host: '',
        password: '',
        db: 0,
      },
    },
  },
  jwtConfig: {
    secret: '',// JWT 密钥,自定义
    expiresIn: '12h',
  },
} as MidwayConfig;
