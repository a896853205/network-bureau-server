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
  try {
    let { code, password } = ctx.state.param,
      token = await service.getEnterpriseToken(code, password);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data: token
    });
  } catch (error) {
    console.error(error);
    ctx.throw(RESPONSE_CODE.error, '用户名或密码错误');
  }
});

/**
 * 创建新企业用户
 */
router.post('/createNewEnterprise', async (ctx, next) => {
  try {
    let { name, password, phone, code } = ctx.state.param;

    await service.createNewEnterprise({
      name,
      password,
      phone,
      code
    });

    ctx.body = new Res({
      status: RESPONSE_CODE.created,
      msg: '创建用户成功'
    });
  } catch (error) {
    throw error;
  }
});

export default router;
