import Router from 'koa-router';
import Res from '../../../util/response';
import { RESPONSE_CODE } from '../../../constants/domain-constants';

// service
import service from '../../../service';

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
    try {
      await service.updateManager(
        managerUuid,
        phone,
        password,
        name,
        headPortraitUrl
      );

      ctx.body = new Res({
        status: RESPONSE_CODE.success,
        msg: '更改管理员成功'
      });
    } catch (error) {
      console.error(error);
      ctx.throw(RESPONSE_CODE.error, '更改管理员失败');
    }
  } else {
    try {
      await service.createNewManager(
        username,
        phone,
        password,
        name,
        role,
        headPortraitUrl
      );

      ctx.body = new Res({
        status: RESPONSE_CODE.created,
        msg: '创建管理用户成功'
      });
    } catch (error) {
      console.error(error);
      ctx.throw(RESPONSE_CODE.error, '用户已存在');
    }
  }
});

/**
 * 删除管理账号
 */
router.del('/deleteManager', async (ctx, next) => {
  try {
    const { managerUuid } = ctx.state.param;

    await service.deleteManager(managerUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.noContent,
      msg: '删除管理员成功'
    });
  } catch (error) {
    console.error(error);
    ctx.throw(RESPONSE_CODE.error, '删除管理员失败');
  }
});

/**
 * 查询管理账号
 */
router.get('/queryManager', async (ctx, next) => {
  try {
    const { page } = ctx.state.param;

    const data = await service.queryManager(page);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    ctx.throw(RESPONSE_CODE.error, '查询失败');
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
router.get('/selectManagerInfo', async ctx => {
  try {
    const { managerUuid } = ctx.state.param;

    const data = await service.selectManagerByManagerUuid(managerUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    ctx.throw(RESPONSE_CODE.error, '查询失败');
  }
});

export default router;
