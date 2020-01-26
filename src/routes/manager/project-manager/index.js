import Router from 'koa-router';
import Res from '../../../util/response';
import { RESPONSE_CODE } from '../../../constants/domain-constants';

import enterpriseRegistrationService from '../../../service/enterprise/enterprise-registration-service';

// 权限
import verifyAuth from '../../../middle/verify-auth';
import { AUTHORITY } from '../../../constants/role-constants';

const PREFIX = '/projectManager',
  router = new Router({
    prefix: PREFIX
  });

router.use(PREFIX, verifyAuth(AUTHORITY.PROJECT_MANAGER.name));

/**
 * 无参数查询sys_registration_step表
 */
router.get('/querySysRegistrationStep', async (ctx, next) => {
  const data = await superManagerUserService.querySysRegistrationStep();

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
 * 查询企业的登记测试列表
 */
router.get('/queryRegistration', async (ctx, next) => {
  const { page } = ctx.state.param;

  const data = await enterpriseRegistrationService.queryRegistration(page);

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