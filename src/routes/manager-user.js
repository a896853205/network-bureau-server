import Router from 'koa-router';
import managerUserService from '../service/manager-user-service';
import Res from '../util/response';
import { RESPONSE_CODE } from '../constants/domain-constants';
const router = new Router();

router.prefix('/managerUser');

/**
 * 管理端登录
 */
router.get('/getManagerToken', async (ctx, next) => {
  let { username, password } = ctx.state.param;

  const token = await managerUserService.getManagerToken(username, password);

  if (token) {
    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data: token
    });
  } else {
    ctx.body = new Res({
      status: RESPONSE_CODE.error,
      msg: '用户名或密码错误'
    });
  }
});

/**
 * 增加管理账号
 */
router.post('/createNewManager', async (ctx, next) => {
  let { username, phone, password, name, role } = ctx.state.param;

  const status = await managerUserService.createNewManager(
    username,
    phone,
    password,
    name,
    role
  );

  if (status) {
    ctx.body = new Res({
      status: RESPONSE_CODE.created,
      msg: '创建管理用户成功'
    });
  } else {
    ctx.body = new Res({
      status: RESPONSE_CODE.error,
      msg: '用户已存在'
    });
  }
});

/**
 * 查询企业账号
 */
router.get('/queryEnterprise', async (ctx, next) => {
  let { id, code, uuid, phone, password, name } = ctx.state.param;
  const data = await managerUserService.queryEnterprise();
  if (data) {
    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      msg: '查询成功'
    });
  } else {
    ctx.body = new Res({
      status: RESPONSE_CODE.noContent,
      msg: '没有用户数据'
    });
  };
});



export default router;
