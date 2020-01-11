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
<<<<<<< HEAD
  let { uuid, username, phone, password, name, role } = ctx.state.param;
  console.log('uuid: '+uuid);
  console.log('username: '+username);
  console.log('phone: '+phone);
  console.log('password: '+password);
  console.log('name: '+name);
  console.log('role: '+role);
=======
  let {
    uuid,
    username,
    phone,
    password,
    name,
    role,
    headPortraitUrl
  } = ctx.state.param;
>>>>>>> b70a1268d8c3b90e01ae70566b9e4594ca8fd5b7

  if (uuid) {
    const status = await managerUserService.updateManager(
      uuid,
      phone,
      password,
      name,
      headPortraitUrl
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
      role,
      headPortraitUrl
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

/**
 * 获取权限列表
 */
router.get('/queryRole', ctx => {
  ctx.body = new Res({
    status: RESPONSE_CODE.success,
    data: Object.values(AUTHORITY)
  });
});

/**
 * 通过uuid查询管理员数据
 */
router.get('/getManagerInfo', async ctx => {
  const { uuid } = ctx.state.param;

  const res = await managerUserService.getManagerByUuid(uuid);

  ctx.body = new Res({
    status: RESPONSE_CODE.success,
    data: res
  });
});

export default router;
