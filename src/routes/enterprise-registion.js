import Router from 'koa-router';

// response
import Res from '../util/response';
import { RESPONSE_CODE } from '../constants/domain-constants';

// service
import enterpriseRegistionService from '../service/enterprise-registion-service';

const router = new Router({
  prefix: '/enterpriseRegistion'
});

router.post('/createEnterpriseRegistion', async (ctx, next) => {
  const { uuid: enterpriseUuid } = ctx.state.user,
    { name } = ctx.state.param;

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
      msg: '登录测试名称重复'
    });
  }
});

export default router;
