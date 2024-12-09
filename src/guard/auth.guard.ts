// src/guard/auth.guard.ts
import { IGuard, Guard, httpError } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Guard()
export class AuthGuard implements IGuard<Context> {
  async canActivate(
    ctx: Context
    //_supplierClz,
    //methodName: string
  ): Promise<boolean> {
    const user = ctx.state.user.userRole;
    if (!user) {
      throw new httpError.UnauthorizedError('User information is missing');
    }
    // 假设角色是 1 表示管理员
    if (!user || user !== '1') {
      throw new Error('ForbiddenError');
    }
    return true; // 如果通过验证，允许访问
  }
}
