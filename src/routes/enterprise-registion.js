import Router from 'koa-router';

// response
import Res from '../util/response';
import { RESPONSE_CODE } from '../constants/domain-constants';

// service
import enterpriseRegistionService from '../service/enterprise-registion-service.js';

const router = new Router({
  prefix: '/enterpriseRegistion'
});

router.post('/createEnterpriseRegistion', async (ctx, next) => {
  let { name, enterpriseUuid } = ctx.state.param;
  console.log(name);
  const status = await enterpriseRegistionService.createEnterpriseRegistion(
    name,
    enterpriseUuid
  );

  if (status) {
    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      msg: '登录测试创建成功'
    });
  } else {
    ctx.body = new Res({
      status: RESPONSE_CODE.error,
      msg: '登录测试已存在'
    });
  }
});
export default router;
