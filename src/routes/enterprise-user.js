import Router from 'koa-router';
import enterpriseService from '../service/enterprise-user-service';
import Res from '../util/response';
import { RESPONSE_CODE } from '../constants/domain-constants';
const router = new Router();

router.prefix('/enterpriseUser');

router.put('/getEnterpriseToken', async (ctx, next) => {
  let { username } = ctx.request.body,
    user = await enterpriseService.selectEnterpriseUserByCode(username);

  if (user) {
    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data: user
    });
  } else {
    ctx.body = new Res({
      status: RESPONSE_CODE.error,
      msg: '没有此用户'
    });
  }
});

export default router;
