import { Provide } from '@midwayjs/core';
import { query } from '../dbConnPool/mariadb'; // 引入查询函数
import { UserDTO } from '../dto/user';
import { Caching } from '@midwayjs/cache-manager';
//import{CachingFactory, MidwayCache}from '@midwayjs/cache-manager';
//import{InjectClient} from '@midwayjs/core';
@Provide()
export class UserDao {
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
    if (ctx.methodArgs.length > 0) { return `findUserId:${ctx.methodArgs[0]}`; }
    return null;
  })
  async findUserById(userId: UserDTO['userId']) {
    const sql = `
      SELECT  
        user_id AS userId,
        name,
        account,
        is_admin AS role,
        department, created_at,
        is_employment
      FROM 
        xuesheng_user
      WHERE 
        user_id = ?
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