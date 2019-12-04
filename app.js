import Koa from 'koa';
import json from 'koa-json';
import onerror from 'koa-onerror';
import bodyparser from 'koa-bodyparser';
import logger from 'koa-logger';
import Result from './src/util/response';

// 跨域
import cors from 'koa2-cors';

// 路由
import users from './src/routes/users';

// 中间件
import verifyToken from './src/middle/verify-token';

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

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(users.routes(), users.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
  ctx.body = new Result({
    status: 0,
    msg: '网络有点问题呦,请稍后再试'
  });
});

module.exports = app;
