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
 * 更新企业用户
 */
router.post('/updateManager', async (ctx,next) => {
  let { uuid, phone, password, name } = ctx.state.param;

  const status = await managerUserService.updateManager(
    uuid, 
    phone, 
    password, 
    name
  );

  if (status) {
    ctx.body = new Res({
      status: RESPONSE_CODE.noContent,
      msg: '更改成功'
    });
  } else {
    ctx.body = new Res({
      status: RESPONSE_CODE.error,
      msg: '更改失败'
    });
  }
});

/**
 * 删除企业用户
 */
router.post('/deleteManager', async (ctx,next) => {
  let { uuid } = ctx.state.param;
  
  const status = await managerUserService.deleteManager(uuid);

  if (status) {
    ctx.body = new Res({
      status: RESPONSE_CODE.noContent,
      msg: '删除成功'
    });
  } else {
    ctx.body = new Res({
      status: RESPONSE_CODE.error,
      msg: '删除失败'
    });
  }
});

export default router;
