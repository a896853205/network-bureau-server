import Router from 'koa-router';

// response
import Res from '../util/response';
import { RESPONSE_CODE } from '../constants/domain-constants';

// service
import managerUserService from '../service/manager-user-service';

const router = new Router({
  prefix: '/managerUser'
});

/**
 * 管理端登录
 */
router.get('/getManagerToken', async (ctx, next) => {
  let { username, password } = ctx.state.param;

  const token = await managerUserService.getManagerToken(username, password);

  if (token) {
    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data: token
    });
  } else {
    ctx.body = new Res({
      status: RESPONSE_CODE.error,
      msg: '用户名或密码错误'
    });
  }
});

export default router;
