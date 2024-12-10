import { Inject, Middleware, httpError, Config } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import { JwtService } from '@midwayjs/jwt';
import { UserService } from '../service/api.user.service'; // 假设你有一个用户服务，用于处理获取用户数据等
import { AuthService } from '../service/api.auth.service'; // 假设你有一个鉴权服务，用于处理鉴权逻辑

@Middleware()
export class JwtMiddleware {
  @Inject()
  jwtService: JwtService;

  @Config('jwtConfig') // 动态注入配置
  jwtConfig: { secret: string; expiresIn: string | number };
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 判断是否有 Authorization header
      const authorization = ctx.headers['authorization'];
      if (!authorization) {
        throw new httpError.UnauthorizedError('缺少 Authorization 头');
      }
      const parts = authorization.trim().split(' ');
      if (parts.length !== 2) {
        throw new httpError.UnauthorizedError('Token 格式无效');
      }
      const [scheme, token] = parts;
      if (/^Bearer$/i.test(scheme)) {
        try {
          // 验证 token 是否有效
          const decoded = await this.jwtService.verify(
            token,
            this.jwtConfig.secret,
            { complete: true }
          );
          // 如果 token 有效，继续请求
          if (typeof decoded === 'string') {
            throw new httpError.UnauthorizedError('无效的 token');
          }
          ctx.state.user = decoded.payload; // 将用户信息保存在 ctx.state 中
          await next();
        } catch (error) {
          if (error.message === 'ForbiddenError') {
            throw new httpError.ForbiddenError(
              'You do not have the necessary permissions'
            );
          }
          if (error.name === 'JsonWebTokenError') {
            throw new httpError.UnauthorizedError('无效或过期的 Token');
          }
          if (error.name === 'TokenExpiredError') {
            // Token 过期时，尝试刷新 token
            const refreshToken = await this.refreshToken(ctx, token);
            ctx.state.newToken = refreshToken; // 添加新的 token
            // 使用新的 Token 获取用户信息
            const authService = await ctx.requestContext.getAsync(AuthService);
            ctx.state.user = await authService.tokenVerify(refreshToken);
            await next();
          } else {
            throw error;
          }
        }
      } else {
        throw new httpError.UnauthorizedError('Token 格式无效');
      }
    };
  }
  // 配置忽略鉴权的路由地址
  public match(ctx: Context): boolean {
    const ignoreRoutes = ['/api/auth/login', '/info', '/api/user/register'];
    const ignore = ignoreRoutes.some(route => ctx.path.indexOf(route) !== -1);
    return !ignore;
  }

  // 刷新 token 的方法
  private async refreshToken(ctx: Context, oldToken: string): Promise<string> {
    // 解码旧的 token
    const decoded = this.jwtService.decode(oldToken, { complete: true });
    ctx.state.user = decoded;
    const payload = decoded?.payload;
    if (typeof payload === 'string') {
      throw new httpError.UnauthorizedError('无效的 token payload');
    }
    const userId = payload?.userId;
    if (!userId) {
      throw new httpError.UnauthorizedError('Token 中未找到用户 ID');
    }
    // 获取用户信息
    const userService = await ctx.requestContext.getAsync(UserService);
    const user = await userService.findById(userId);
    if (!user) {
      throw new httpError.UnauthorizedError('用户未找到');
    }
    // 创建新的 Token
    const newToken = await this.jwtService.sign(
      {
        userId: user.userId,
        userAccount: user.account,
        userRole: user.role,
      },
      this.jwtConfig.secret,
      {
        expiresIn: '12h',
      }
    );
    return newToken;
  }
  public static getName(): string {
    return 'jwt';
  }
}
