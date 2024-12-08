import { InjectClient, Provide, Inject } from '@midwayjs/core';
import { RedisService } from '@midwayjs/redis';
import { query } from '../dbConnPool/mariadb'; // 引入查询函数
import { UserDTO } from '../dto/user';
import { Caching, CachingFactory, MidwayCache } from '@midwayjs/cache-manager';

@Provide()
export class UserDao {
  @Inject()
  redisService: RedisService; // 注入 Redis 服务

  //  获取用户信息
  // @Caching('redis', (ctx) => {
  //   if (ctx.methodArgs.length > 0) {
  //     return `user:${ctx.methodArgs[0]}`;
  //   }
  //   return null;
  // })
  @InjectClient(CachingFactory, 'redis')
  cache: MidwayCache;
  async getUser(userId: UserDTO['userId']) {
    const user = await this.cache.get(`user:${userId}`);
    if (user!==undefined) {return user;}
    const sql = `
      SELECT name, department, created_at, is_employment
        FROM xuesheng_user
        WHERE user_id = ?
    `;
    const sqlParams = [userId];
    const result = (await query(sql, sqlParams))[0];
    await this.cache.set(`user:${userId}`,result);
    return result;
  }
  // 新添加用户
  async addUser(body: UserDTO) {
    const sql = `
      INSERT INTO xuesheng_user
        (name, account, email, password, created_at)
        VALUES (?, ?, ?, ?, NOW())
    `;
    const sqlParams = [body.name, body.account, body.email, body.hashPassword];
    return await query(sql, sqlParams);
  }

  // 查找用户
  @Caching('redis', (ctx) => {
    if (ctx.methodArgs.length > 0) {return `user:${ctx.methodArgs[0]}`;}
    return null;
  })
  async findUserById(userId: UserDTO['userId']) {
    const sql = `
      SELECT 
        user_id AS userId,
        account,
        is_admin AS role,
        password AS passwordHsah
      FROM xuesheng_user
        WHERE user_id = ?
    `;
    const sqlParams = [userId];
    return (await query(sql, sqlParams))[0];
  }

  // 新用户注册
  async register(body: UserDTO) {
    const sql = `
      INSERT INTO xuesheng_user
        (account, name, email, password, department, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const sqlParams = [body.account, body.name, body.email, body.hashPassword, body.department];
    return await query(sql, sqlParams);
  }
}