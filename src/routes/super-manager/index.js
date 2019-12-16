import Router from 'koa-router';
import Res from '../../util/response';
import { RESPONSE_CODE } from '../../constants/domain-constants';

const router = new Router();

router.prefix('superManager');

export default router;
