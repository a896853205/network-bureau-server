import Router from 'koa-router';

// response
import Res from '../../util/response';
import { RESPONSE_CODE } from '../../constants/domain-constants';

// service
import service from '../../service';

const router = new Router({
  prefix: '/enterprise'
});

/**
 * 企业用户登录
 */
router.get('/getEnterpriseToken', async (ctx, next) => {
  let { code, password } = ctx.state.param,
    token = await service.getEnterpriseToken(code, password);

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

/**
 * 创建新企业用户
 */
router.post('/createNewEnterprise', async (ctx, next) => {
  let { name, password, phone, code } = ctx.state.param;

  const status = await service.createNewEnterprise({
    name,
    password,
    phone,
    code
  });

  if (status) {
    ctx.body = new Res({
      status: RESPONSE_CODE.created,
      msg: '创建用户成功'
    });
  } else {
    ctx.body = new Res({
      status: RESPONSE_CODE.error,
      msg: '用户已存在'
    });
  }
});

export default router;
