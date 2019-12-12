import Router from 'koa-router';
import enterpriseService from '../service/enterprise-user-service';
import Res from '../util/response';
import { RESPONSE_CODE } from '../constants/domain-constants';
const router = new Router();

router.prefix('/enterpriseUser');

/**
 * 用户登录
 */
router.get('/getEnterpriseToken', async (ctx, next) => {
  let { code, password } = ctx.state.param,
    token = await enterpriseService.getEnterpriseToken(code, password);

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
 * 创建新用户
 */
router.post('/createNewEnterprise', async (ctx, next) => {
  let { name, password, phone, code } = ctx.state.param;

  const status = await enterpriseService.createNewEnterprise({
    name,
    password,
    phone,
    code
  });

  if (status) {
    ctx.body = new Res({
      status: RESPONSE_CODE.success,
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
