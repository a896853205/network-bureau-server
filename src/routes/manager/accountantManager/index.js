import Router from 'koa-router';
import Res from '../../../util/response';
import { RESPONSE_CODE } from '../../../constants/domain-constants';

// 权限
import { AUTHORITY } from '../../../constants/role-constants';

const router = new Router({
  prefix: AUTHORITY.PROJECT_MANAGER.router
});

export default router;
