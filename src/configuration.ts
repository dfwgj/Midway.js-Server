import {
  Configuration,
  App,
  Inject,
  MidwayDecoratorService,
} from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as jwt from '@midwayjs/jwt';
import { join } from 'path';
import { ErrorFilter } from './filter/error.filter';
import { ReportMiddleware } from './middleware/report.middleware';
import { JwtMiddleware } from './middleware/jwt.middleware';
import { FormatMiddleware } from './middleware/api.middleware';
import * as cacheManager from '@midwayjs/cache-manager';
import * as redis from '@midwayjs/redis';
import * as codeDye from '@midwayjs/code-dye';
//import { AuthGuard } from "./guard/auth.guard";

@Configuration({
  imports: [
    koa,
    validate,
    jwt,
    redis,
    cacheManager,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
    {
      component: codeDye,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;
  @Inject()
  decoratorService: MidwayDecoratorService;

  async onReady() {
    // 添加中间件
    this.app.useMiddleware([ReportMiddleware, JwtMiddleware, FormatMiddleware]); // 这里添加你想要的所有中间件
    // 添加过滤器
    this.app.useFilter([ErrorFilter]);
    // 添加全局守卫
    //this.app.useGuard(AuthGuard);
    console.log('Application is ready');
  }
}
