import Router from 'koa-router';
import enterpriseService from '../service/enterprise-user-service';
import Res from '../util/response';
import { RESPONSE_CODE } from '../constants/domain-constants';
const router = new Router();

router.prefix('/enterpriseUser');

/**
 * 用户登录
 */
router.put('/getEnterpriseToken', async (ctx, next) => {
  let { username, password } = ctx.state.param,
    token = await enterpriseService.getEnterpriseToken(username, password);

  if (token) {
    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data: token
    });
  } else {
    ctx.body = new Res({
      status: RESPONSE_CODE.error,
      msg: '没有此用户'
    });
  }
});

export default router;
