import Router from 'koa-router';
import Res from '../../../util/response';
import { RESPONSE_CODE } from '../../../constants/domain-constants';

// service
import managerUserService from '../../../service/manager/manager-user-service';

// 权限
import { AUTHORITY } from '../../../constants/role-constants';

const router = new Router({
  prefix: AUTHORITY.SUPER.router
});

/**
 * 增加/更新管理账号
 */
router.post('/saveManager', async (ctx, next) => {
  let {
    managerUuid,
    username,
    phone,
    password,
    name,
    role,
    headPortraitUrl
  } = ctx.state.param;

  if (managerUuid) {
    const status = await managerUserService.updateManager(
      managerUuid,
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
  const { managerUuid } = ctx.state.param;

  const status = await managerUserService.deleteManager(managerUuid);

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
 * 通过managerUuid查询管理员数据
 */
router.get('/getManagerInfo', async ctx => {
  const { managerUuid } = ctx.state.param;

  const res = await managerUserService.getManagerByManagerUuid(managerUuid);

  ctx.body = new Res({
    status: RESPONSE_CODE.success,
    data: res
  });
});

export default router;
