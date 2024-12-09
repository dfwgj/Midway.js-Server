import { Inject, Controller, Post, Put, Body, Headers, UseGuard } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { AuthService } from '../service/api.auth.service';
import { UserService } from '../service/api.user.service';
import { UserDTO, LoginDTO } from '../dto/user';
import { AuthGuard } from '../guard/auth.guard';

@Controller('/auth')
export class LoginController {
  @Inject()
  ctx: Context;

  @Inject()
  authService: AuthService;

  @Inject()
  userService: UserService;

  /**
   * @name login 用户登录
   * @description POST /auth/login
   * @param {string} account - 用户账号
   * @param {string} password - 用户密码
   * @returns {Object} token - 登录凭证
   */
  @Post('/login')
  async login(@Body() body: LoginDTO): Promise<string> {
    try {
      return await this.authService.login(body);
    } catch (error) {
      throw error;
    }
  }
  /**
   * @name tokenVerify 凭证校验
   * @description POST /auth/tokenVerify
   * @header {string} Authorization 用户凭证
   * @returns {Object} payload 凭证负载
   */
  @Post('/tokenVerify')
  async tokenVerify(@Headers('Authorization') token: UserDTO["token"]): Promise<Object> {
    token = this.ctx.request.header.authorization.split(' ')[1];
    try {
      return await this.authService.tokenVerify(token);
    } catch (error) {
      throw error; // 或直接抛出错误以确保函数处理完
    }
  }
  /**
   * @name setAdmin 登出
   * @description Put /auth/setAdmin
   * @param {string} userId - 用户id
   * @returns {Object} success 成功提示
   */
  @UseGuard(AuthGuard)
  @Put('/setAdmin')
  async setAdmin(@Body() { userId }: { userId: UserDTO["userId"] }): Promise<object> {
    try {
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new Error('用户不存在');
      }
      return await this.authService.setAdmin(userId);
    } catch (error) {
      throw error;
    }
  }
}
