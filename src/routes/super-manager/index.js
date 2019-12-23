import Router from 'koa-router';
import Res from '../../util/response';
import { RESPONSE_CODE } from '../../constants/domain-constants';

// service
import managerUserService from '../../service/manager-user-service';

// 权限
import verifyAuth from '../../middle/verify-auth';
import { AUTHORITY } from '../../constants/role-constants';

const PREFIX = '/superManager',
  router = new Router({
    prefix: PREFIX
  });

router.use(PREFIX, verifyAuth(AUTHORITY.SUPER.name));

/**
 * 增加/更新管理账号
 */
router.post('/saveManager', async (ctx, next) => {
  let { uuid, username, phone, password, name, role } = ctx.state.param;

  if (uuid) {
    const status = await managerUserService.updateManager(
      uuid,
      phone,
      password,
      name
    );

    if (status) {
      ctx.body = new Res({
        status: RESPONSE_CODE.success,
        msg: '更改管理员成功'
      });
    } else {
      ctx.body = new Res({
        status: RESPONSE_CODE.error,
        msg: '更改管理员失败'
      });
    }
  } else {
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
  }
});

/**
 * 删除管理账号
 */
router.del('/deleteManager', async (ctx, next) => {
  let { uuid } = ctx.state.param;

  const status = await managerUserService.deleteManager(uuid);

  if (status) {
    ctx.body = new Res({
      status: RESPONSE_CODE.noContent,
      msg: '删除管理员成功'
    });
  } else {
    ctx.body = new Res({
      status: RESPONSE_CODE.error,
      msg: '删除管理员失败'
    });
  }
});

/**
 * 查询管理账号
 */
router.get('/queryManager', async (ctx, next) => {
  const { page } = ctx.state.param;

  const data = await managerUserService.queryManager(page);

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
