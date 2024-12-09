import { Provide, Inject, Config } from "@midwayjs/core";
import { JwtService } from "@midwayjs/jwt";
import { Context } from "@midwayjs/koa";
import * as bcrypt from "bcrypt";
import { AuthDao } from "../dao/authDao";
import { BigIntService } from "./bigInt.service";
import { LoginDTO, UserDTO } from "../dto/user";
import { UserDao } from "../dao/userDao";

@Provide()
export class AuthService {
  @Inject()
  ctx: Context;
  @Inject()
  jwtService: JwtService;
  @Inject()
  authDao: AuthDao;
  @Inject()
  userDao: UserDao;
  @Inject()
  bigIntService: BigIntService; //BigInt转换
  @Config("jwtConfig") // 动态注入配置
  jwtConfig: { secret: string; expiresIn: string | number };

  // 登录方法
  async login(body: LoginDTO) {
    try {
      // 获取用户实体
      const user = await this.authDao.login(body.account);
      if (!user || user.length === 0) {
        // 用户不存在
        throw new Error("账户不存在");
      }
      // 验证密码
      const match = await bcrypt.compare(body.password, user.passwordHash);
      if (!match) {
        throw new Error("密码错误");
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
      throw error; // 抛出具体的错误信息
    }
  }
  // Token 验证方法
  async tokenVerify(token: UserDTO["token"]) {
    try {
      const decoded: any = await this.jwtService.verify(
        token,
        this.jwtConfig.secret,
        { complete: true }
      );
      return decoded.payload;
    } catch (error) {
      throw error;
    }
  }
  //设置管理员
  async setAdmin(userId: UserDTO["userId"]) {
    try {
      return await this.authDao.setAdmin(userId);
    } catch (error) {
      throw error;
    }
  }
}
