// src/filters/error.filter.ts
import { Catch, HttpStatus, httpError } from '@midwayjs/core';
import { MidwayValidationError } from '@midwayjs/validate';
import { Context } from '@midwayjs/koa';

// 默认错误过滤器定义
@Catch()
export class ErrorFilter {
  // 捕获错误并处理响应
  /**
   * 处理捕获到的错误，并返回相应的错误响应
   * @param err 捕获到的错误
   * @param ctx 请求上下文
   * @returns 返回错误响应对象
   */
  async catch(err: Error, ctx: Context) {
    let statusCode = 500; // 默认是服务器错误
    let message = 'Internal Server Error'; // 默认错误消息
    // 根据不同的错误类型进行处理
    if (
      err instanceof httpError.BadRequestError ||
      err instanceof MidwayValidationError
    ) {
      statusCode = HttpStatus.BAD_REQUEST;
      message = 'Bad request';
    } else if (err instanceof httpError.UnauthorizedError) {
      statusCode = HttpStatus.UNAUTHORIZED;
      message = 'Unauthorized';
    } else if (err instanceof httpError.ForbiddenError) {
      statusCode = HttpStatus.FORBIDDEN;
      message = 'Forbidden';
    } else if (err instanceof httpError.InternalServerErrorError) {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }

    // 设置响应状态码
    ctx.status = statusCode;
    // 返回统一格式的错误响应
    return {
      code: ctx.status,
      message,
      error: err.stack, // 开发模式下使用
      // error: err.message, // 生产模式下使用
    };
  }
}
