import { Provide, Inject } from '@midwayjs/core';
import { RedisService } from '@midwayjs/redis';
import { query } from '../dbConnPool/mariadb'; // 引入查询函数
import { UserDTO } from '../dto/user';

@Provide()
export class UserDao {
  @Inject()
  redisService: RedisService; // 注入 Redis 服务

  // 获取用户信息
  async getUser(userId: UserDTO['userId']) {
    // 尝试从 Redis 获取用户信息
    console.log(`Fetching user data for userId: ${userId}`);
    const cachedUser = await this.redisService.get(`user:${userId}`);
    if (cachedUser) {
      return cachedUser;
    }
    // 如果 Redis 中没有，从数据库查询
    const sql = `
      SELECT name, department, created_at, is_employment
        FROM xuesheng_user
        WHERE user_id = ?
    `;
    const sqlParams = [userId];
    const user = await query(sql, sqlParams);

    // 将用户信息缓存到 Redis
    if (user && user.length > 0) {
      await this.redisService.set(`user:${userId}`, JSON.stringify(user[0]));
    }
    return user[0];
  }

  // 新添加用户
  async addUser(body: UserDTO) {
    const sql = `
      INSERT INTO xuesheng_user
        (name, account, email, password, created_at)
        VALUES (?, ?, ?, ?, NOW())
    `;
    const sqlParams = [body.name, body.account, body.email, body.hashPassword];
    const result = await query(sql, sqlParams);

    // 如果添加成功，清除对应用户的缓存
    if (result.insertId) {
      await this.redisService.del(`user:${result.insertId}`);
    }

    return result;
  }

  // 查找用户
  async findUserById(userId: UserDTO['userId']) {
    // 尝试从 Redis 获取用户信息
    const cachedUser = await this.redisService.get(`user:${userId}`);
    if (cachedUser) {
      return cachedUser;
    }
    // 如果 Redis 中没有，从数据库查询
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
    const user = await query(sql, sqlParams);
    // 将用户信息缓存到 Redis
    if (user && user.length > 0) {
      await this.redisService.set(`user:${userId}`, JSON.stringify(user[0]));
    }
    return user[0];
  }

  // 新用户注册
  async register(body: UserDTO) {
    const sql = `
      INSERT INTO xuesheng_user
        (account, name, email, password, department, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const sqlParams = [body.account, body.name, body.email, body.hashPassword, body.department];
    const result = await query(sql, sqlParams);
    // 如果注册成功，清除对应用户的缓存
    if (result.insertId) {
      await this.redisService.del(`user:${result.insertId}`);
    }
    return result;
  }
}