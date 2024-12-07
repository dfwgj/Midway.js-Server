import { Middleware, IMiddleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';

// 定义一个中间件类 FormatMiddleware，实现 IMiddleware 接口
@Middleware()
export class FormatMiddleware implements IMiddleware<Context, NextFunction> {
    // 解析方法，返回一个中间件函数
    resolve() {
        return async (ctx: Context, next: NextFunction) => {
            const result = await next();
            return {
                code: 0,
                message: 'OK',
                data: result,
            }
        };
    }

    // 匹配方法，判断请求路径是否包含 '/api'
    match(ctx: { path: string | string[]; }) {
        return ctx.path.indexOf('/api') !== -1;
    }
    public static getName(): string {
        return 'api';
    }

}