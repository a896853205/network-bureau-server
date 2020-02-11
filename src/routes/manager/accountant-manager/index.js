import Router from 'koa-router';
import Res from '../../../util/response';
import { RESPONSE_CODE } from '../../../constants/domain-constants';

// 权限
import { AUTHORITY } from '../../../constants/role-constants';

import enterpriseRegistrationService from '../../../service/enterprise/enterprise-registration-service';

const router = new Router({
  prefix: AUTHORITY.ACCOUNTANT.router
});

/**
 * 财务确认已付款
 */
router.put('/accountantConfirmPayment', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await enterpriseRegistrationService.accountantConfirmPayment(
    registrationUuid,
  );

  if (data) {
    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } else {
    ctx.body = new Res({
      status: RESPONSE_CODE.error
    });
  }
});

/**
 * 查询企业的缴费信息
 */
router.get('/queryRegistrationPayment', async (ctx, next) => {
  const { page, managerUuid } = ctx.state.param;

  const data = await enterpriseRegistrationService.queryRegistrationPayment({
    page,
    managerUuid
  });

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

export default router;
