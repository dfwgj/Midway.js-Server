import { Provide, Inject, Config } from '@midwayjs/core';
import { JwtService } from '@midwayjs/jwt';
import { Context } from '@midwayjs/koa';
import * as bcrypt from 'bcrypt';
import { AuthDao } from '../dao/authDao';
import { BigIntService } from './bigInt.service';
import { LoginDTO, UserDTO } from '../dto/user'

@Provide()
export class AuthService {
  @Inject()
  ctx: Context;
  @Inject()
  jwtService: JwtService;
  @Inject()
  authDao: AuthDao;
  @Inject()
  bigIntService: BigIntService;
  @Config('jwtConfig') // 动态注入配置
  jwtConfig: { secret: string; expiresIn: string | number };

  // 登录方法

  async login(body: LoginDTO) {
    try {
      // 获取用户实体
      const user = await this.authDao.login(body.account);
      if (!user || user.length === 0) {
        // 用户不存在
        throw new Error('账户不存在');
      }
      // 验证密码
      const match = await bcrypt.compare(body.password, user.passwordHash);
      if (!match) {
        throw new Error('密码错误');
      }
      // 生成 token
      return await this.jwtService.sign(
        {
          userId: user.userId,
          userAccount: user.account,
          userRole: user.role,
        },
        this.jwtConfig.secret,
        {
          expiresIn: this.jwtConfig.expiresIn,
        }
      );
    } catch (error) {
      throw error// 抛出具体的错误信息
    }
  }
  // Token 验证方法
  async tokenVerify(token: UserDTO['token']) {
    try {
      return await this.jwtService.verify(token, this.jwtConfig.secret);
    } catch (error) {
      throw error;
    }
  }
  // 根据 Token 获取用户信息
  async getUserByToken(token: UserDTO['token']) {
    try {
      // 解码 token 获取用户 ID
      const decoded: any = await this.jwtService.verify(token, this.jwtConfig.secret, { complete: true });
      const userId = decoded.payload.userId;
      // 使用 userId 查询用户信息
      let user = await this.authDao.getUserById(userId);
      console.log(user)
      user = {
        userId: user.userId,
        userAccount: user.account,
        userRole: user.role,
      }
      if (!user) {
        throw new Error('用户不存在');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
  //设置管理员
  async setAdmin(userId: UserDTO['userId']) {
    try {
      return this.bigIntService.bigInt(await this.authDao.setAdmin(userId));
    } catch (error) {
      throw error;
    }
  }
}

