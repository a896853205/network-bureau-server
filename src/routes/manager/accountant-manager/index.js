import Router from 'koa-router';
import Res from '../../../util/response';
import { RESPONSE_CODE } from '../../../constants/domain-constants';

// 权限
import { AUTHORITY } from '../../../constants/role-constants';

// services
import service from '../../../service';

const router = new Router({
  prefix: AUTHORITY.ACCOUNTANT.router
});

/**
 * 财务确认已付款
 */
router.put('/accountantConfirmPayment', async (ctx, next) => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.accountantConfirmPayment(registrationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    console.error(error);
    ctx.throw(RESPONSE_CODE.error, '确认付款失败');
  }
});

/**
 * 查询企业的缴费信息
 */
router.get('/queryRegistrationPayment', async (ctx, next) => {
  try {
    const { page } = ctx.state.param;
    const managerUuid = ctx.state.user.uuid;

    const data = await service.queryRegistrationPayment({
      page,
      managerUuid
    });

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    console.error(error);
    ctx.throw(RESPONSE_CODE.error, '查询失败');
  }
});

export default router;
