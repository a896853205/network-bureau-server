import Router from 'koa-router';
import Res from '../../../util/response';
import { RESPONSE_CODE } from '../../../constants/domain-constants';

// 权限
import { AUTHORITY } from '../../../constants/role-constants';

// service
import service from '../../../service';

const router = new Router({
  prefix: AUTHORITY.TECH_LEADER.router
});

/**
 * 查询待分配技术负责人员的企业登记测试列表
 */
router.get('/queryRegistrationNeedAssigned', async (ctx, next) => {
  const { page } = ctx.state.param;
  const managerUuid = ctx.state.user.uuid;

  const data = await service.queryRegistrationNeedAssigned({
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
