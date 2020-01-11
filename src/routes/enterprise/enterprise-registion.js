import Router from 'koa-router';

// response
import Res from '../../util/response';
import { RESPONSE_CODE } from '../../constants/domain-constants';

// service
import enterpriseRegistionService from '../../service/enterprise/enterprise-registion-service';

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

/**
 * 查询企业的登记测试列表
 */
router.get('/queryRegistionByEnterpriseUuid', async (ctx, next) => {
  const { uuid: enterpriseUuid } = ctx.state.user,
    { page } = ctx.state.param;

  const data = await enterpriseRegistionService.queryRegistionByEnterpriseUuid(
    enterpriseUuid,
    page
  );

  if (data) {
    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } else {
    ctx.body = new Res({
      status: RESPONSE_CODE.error,
      msg: '查询失败'
    });
  }
});

/**
 * 查询企业用户登记测试七个状态通过enterpriseUuid
 */
router.get('/selectRegistionByEnterpriseUuid', async (ctx, next) => {
  const { uuid } = ctx.state.param;

  const data = await enterpriseRegistionService.selectRegistionByEnterpriseUuid(
    uuid
  );

  if (data) {
    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } else {
    ctx.body = new Res({
      status: RESPONSE_CODE.error,
      msg: '查询失败'
    });
  }
});

/**
 * 无参数查询sys_registion_step表
 */
router.get('/querySysRegistionStep', async (ctx, next) => {
  const data = await enterpriseRegistionService.querySysRegistionStep();
  if (data) {
    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    }) 
  }else {
    ctx.body = new Res({
      status: RESPONSE_CODE.error,
      msg: '查询失败'
    });
  }
});

export default router;
