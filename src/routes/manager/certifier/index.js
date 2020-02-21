import Router from 'koa-router';
import Res from '../../../util/response';
import { RESPONSE_CODE } from '../../../constants/domain-constants';

// 权限
import { AUTHORITY } from '../../../constants/role-constants';

// services
import service from '../../../service';

const router = new Router({
  prefix: AUTHORITY.CERTIFIER.router
});

export default router;