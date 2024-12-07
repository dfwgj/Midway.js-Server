import { Provide, Inject } from '@midwayjs/core';
import { UserDao } from '../dao/userDao';
import { UserDTO } from '../dto/user';
import * as bcrypt from 'bcrypt';
import { BigIntService } from '../service/bigInt.service';

@Provide()


export class UserService {

  @Inject()
  userDao: UserDao;
  @Inject()
  bigIntService: BigIntService;
  // 获取用户信息的方法
  async getUser(userId: UserDTO['userId']) {
    try {
      return await this.userDao.getUser(userId);
    } catch (error) {
      throw error;
    }
  }

  // 添加新用户的方法
  async addUser(body: UserDTO) {
    try {
      // 使用 bcrypt.hash 的 Promise 版本来处理异步
      body.hashPassword = await bcrypt.hash(body.password, 10);
      // 调用 DAO 层进行数据库插入操作
      // 在返回结果之前进行 BigInt 转换
      return this.bigIntService.bigInt(await this.userDao.addUser(body));
    } catch (error) {
      throw error;
    }
  }

  // 通过用户 ID 查找用户
  async findById(userId: UserDTO['userId']) {
    try {
      // 从数据库中查询用户信息
      const user = await this.userDao.findUserById(userId);
      return this.bigIntService.bigInt(user);
    } catch (error) {
      throw error;
    }
  }
  // 通过用户账号查找用户
  async register(body: UserDTO) {
    try {
      body.hashPassword = await bcrypt.hash(body.password, 10);
      return this.bigIntService.bigInt(await this.userDao.register(body));
    } catch (error) {
      throw error;
    }
  }
}
