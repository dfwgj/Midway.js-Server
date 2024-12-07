import { Inject, Controller, Get, Query, Post, Body, UseGuard } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { UserDTO } from '../dto/user';
import { AuthGuard } from '../guard/auth.guard';

@Controller('/api/user')
//使用@Controller 装饰器定义了一个控制器，路由前缀为 /api/user。这意味着所有与用户相关的请求都将以这个路径开头。
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;
  /**
   * @name getUser 获取用户信息
   * @description GET /api/user/getUser?userId=xxx
   * @param {string} userId - 用户ID
   * @returns {object} user - 用户信息
   */
  @UseGuard(AuthGuard)
  @Get('/getUser')
  async getUser(@Query('userId') userId: UserDTO['userId']): Promise<object> {
    // 检查 uid 是否存在
    try {
      return await this.userService.getUser(userId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @name addUser 添加用户
   * @description POST /api/user/addUser
   * @param {string} name - 用户名
   * @param {string} account - 账号
   * @param {string} password - 密码
   * @returns {object} user - 用户信息
   * */
  @Post('/addUser')
  async addUser(
    @Body() body: UserDTO): Promise<object> {
    try {
      return await this.userService.addUser(body);
    } catch (error) {
      throw error;
    }
  }
  /**
   * @name register 用户注册
   * @description POST /api/user/register
   * @param {string} name - 用户名
   * @param {string} account - 账号
   * @param {string} password - 密码
   * @returns {object} user - 用户信息
   * */
  @Post('/register')
  async register(@Body() body: UserDTO): Promise<object> {
    try {
      return await this.userService.register(body);
    } catch (error) {
      throw error
    }
  }
}