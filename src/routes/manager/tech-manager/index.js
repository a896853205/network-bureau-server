import Router from 'koa-router';
import Res from '../../../util/response';
import { RESPONSE_CODE } from '../../../constants/domain-constants';

// 权限
import { AUTHORITY } from '../../../constants/role-constants';

// service
import service from '../../../service';

const router = new Router({
  prefix: AUTHORITY.TECH.router
});

/**
 * 技术人员查找注册登记信息
 */
router.get('/quaryRegistratiomNeedFieldTest', async (ctx, next) => {
  try{
  const { page } = ctx.state.param;
  const managerUuid = ctx.state.user.uuid;

  const data = await service.quaryRegistratiomNeedFieldTest({
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