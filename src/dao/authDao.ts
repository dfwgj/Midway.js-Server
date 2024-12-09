import { Inject, Provide } from '@midwayjs/core';
import { InjectClient } from '@midwayjs/core';
import { query } from '../dbConnPool/mariadb'; // 引入查询函数
import { LoginDTO, UserDTO } from '../dto/user';
import { UserDao } from './userDao';
import { CachingFactory, MidwayCache } from '@midwayjs/cache-manager';
//import { Caching} from "@midwayjs/cache-manager";

@Provide()
export class AuthDao {
  @Inject()
  userDao: UserDao;
  // 登录验证
  async login(account: LoginDTO['account']) {
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
    return (await query(sql, sqlParams))[0];
  }
  //设置管理员
  @InjectClient(CachingFactory, 'redis')
  cache: MidwayCache; //redis缓存
  async setAdmin(userId: UserDTO['userId']) {
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
      await this.cache.del(`findUserId:${userId}`);
      return await this.userDao.findUserById(userId);
    }
  }
}
