import Koa from 'koa';
import json from 'koa-json';
import onerror from 'koa-onerror';
import bodyparser from 'koa-bodyparser';
import logger from 'koa-logger';

// 跨域
import cors from 'koa2-cors';

// 路由
import enterpriseUsers from './src/routes/enterprise-user';
import managerUsers from './src/routes/manager-user';
import superManager from './src/routes/super-manager';
import enterpriseRegistion from './src/routes/enterprise-registion';

import file from './src/routes/file';

// 中间件
import verifyToken from './src/middle/verify-token';
import param from './src/middle/param';

const app = new Koa();

app.use(cors());

// error handler
onerror(app);

// middlewares
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text']
  })
);
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));
app.use(verifyToken);
app.use(param);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(enterpriseUsers.routes(), enterpriseUsers.allowedMethods());
app.use(managerUsers.routes(), managerUsers.allowedMethods());
// 超级管理员权限
app.use(superManager.routes(), superManager.allowedMethods());
app.use(enterpriseRegistion.routes(), enterpriseRegistion.allowedMethods());
app.use(file.routes(), file.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
