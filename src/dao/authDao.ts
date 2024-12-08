import { Inject, Provide } from '@midwayjs/core';
import { query } from '../dbConnPool/mariadb'; // 引入查询函数
import { LoginDTO, UserDTO } from '../dto/user';
import { CustomRedisService } from '../service/redis.service';
import { Caching } from '@midwayjs/cache-manager';

@Provide()
export class AuthDao {
  @Inject()
  redisService: CustomRedisService;
  // 登录验证
  async login(account: LoginDTO["account"]) {
    const sql = `
    SELECT
        user_id AS userId,
        account,
        is_admin AS role,
        password AS passwordHash
    FROM
        xuesheng_user
    WHERE
        account = ?
`;
    const sqlParams = [account];
    console.log('account', account);
    return (await query(sql, sqlParams))[0];
  }
  // 获取用户信息
  @Caching('redis', (userId) => {
    if (userId.methodArgs.length > 0) {
      console.log('user6666', `userId:${userId.methodArgs[0]}`);
      return `userId:${userId.methodArgs[0]}`;
    }
    return null;
  })
  async getUserById(userId: UserDTO["userId"]) {
    const sql = `
    SELECT
        user_id AS userId,
        account ,
        is_admin AS role
    FROM
        xuesheng_user
    WHERE
        user_id = ?
`;
    const sqlParams = [userId];
    const user = (await query(sql, sqlParams))[0];
    console.log('user1111', user);
    return user;
  }
  
  async setAdmin(userId: UserDTO["userId"]) {
    // 更新数据库中的用户角色为管理员
    const sql = `
      UPDATE
        xuesheng_user
      SET
        is_admin = 1
      WHERE
        user_id = ?
    `;
    const sqlParams = [userId];
    const result = await query(sql, sqlParams);

    // 如果更新成功，更新 Redis 缓存
    if (result.affectedRows > 0) {
      // 清除缓存中的旧数据
      await this.redisService.del(`user:${userId}`);
      // 重新从数据库中查询用户信息
      const sqlUser = `
        SELECT
          user_id AS userId,
          account,
          is_admin AS role,
          password AS passwordHash
        FROM
          xuesheng_user
        WHERE
          user_id = ?
      `;
      const user = await query(sqlUser, [userId]);
      // 将更新后的用户信息缓存到 Redis
      if (user && user.length > 0) {
        await this.redisService.set(`user:${user[0].userId}`, JSON.stringify(user[0]));
      }
    }
    return result;
  }

};
