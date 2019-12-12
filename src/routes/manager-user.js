import Router from 'koa-router';
import Res from '../util/response';
import { RESPONSE_CODE } from '../constants/domain-constants';
const router = new Router();

router.prefix('/managerUser');

/**
 * 管理端登录
 */
router.get('/getManagerToken', async (ctx, next) => {});
