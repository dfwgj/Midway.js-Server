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
    const sql = `
      SELECT name, department, created_at, is_employment
        FROM xuesheng_user
        WHERE user_id = ?
    `;
    const sqlParams = [userId];
    return await query(sql, sqlParams);
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
    return await query(sql, sqlParams)[0];
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