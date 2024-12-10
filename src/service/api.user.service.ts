import { Provide, Inject } from '@midwayjs/core';
import { UserDao } from '../dao/userDao';
import { UserDTO } from '../dto/user';
import * as bcrypt from 'bcryptjs';
import { BigIntService } from './bigInt.service';

@Provide()
export class UserService {
  @Inject()
  userDao: UserDao;
  @Inject()
  bigIntService: BigIntService;

  // 添加新用户的方法
  async addUser(body: UserDTO) {
    // 使用 bcrypt.hash 的 Promise 版本来处理异步
    body.hashPassword = await bcrypt.hash(body.password, 10);
    // 在返回结果之前进行 BigInt 转换
    return this.bigIntService.bigInt(await this.userDao.addUser(body));
  }
  // 通过用户 ID 查找用户
  async findById(userId: UserDTO['userId']) {
    // 从数据库中查询用户信息
    return await this.userDao.findUserById(userId);
  }
  // 通过用户注册
  async register(body: UserDTO) {
    body.hashPassword = await bcrypt.hash(body.password, 10);
    return this.bigIntService.bigInt(await this.userDao.register(body));
  }
}
