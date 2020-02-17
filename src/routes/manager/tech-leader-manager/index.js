import Router from 'koa-router';
import Res from '../../../util/response';
import { RESPONSE_CODE } from '../../../constants/domain-constants';

// 权限
import { AUTHORITY } from '../../../constants/role-constants';

// service
import service from '../../../service';

const router = new Router({
  prefix: AUTHORITY.TECH_LEADER.router
});

/**
 * 查询待分配技术负责人员的企业登记测试列表
 */
router.get('/queryRegistrationNeedAssigned', async (ctx, next) => {
  const { page } = ctx.state.param;
  const managerUuid = ctx.state.user.uuid;

  const data = await service.queryRegistrationNeedAssigned({
    page,
    managerUuid
  });

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
 * 查询技术人员
 */
router.get('/queryTechManager', async (ctx, next) => {
  const { page } = ctx.state.param;

  const data = await service.queryTechManager(page);

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
 * 更新技术人员
 */
router.post('/arrangeTechManager', async (ctx, next) => {
  const { registrationUuid, techManagerUuid } = ctx.state.param;

  const data = await service.arrangeTechManager({
    registrationUuid,
    techManagerUuid
  });

  if (data) {
    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data,
      msg: '已选择技术人员'
    });
  } else {
    ctx.body = new Res({
      status: RESPONSE_CODE.error
    });
  }
});

/**
 * 根据registrationUuid查询具体步骤
 */
router.get('/queryTechLeaderEnterpriseRegistrationStep', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await service.queryEnterpriseRegistrationStepByRegistrationUuid(
    registrationUuid
  );

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
 * 查询登记测试信息(单独)
 */
router.get('/selectTechLeaderRegistration', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await service.selectRegistrationByRegistrationUuid(
    registrationUuid
  );

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
 * 查询登记测试管理员信息(文件审核页面)
 */
router.get('/selectRegistrationManagerUuid', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await service.selectRegistrationByRegistrationUuid(
    registrationUuid
  );

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
 * 查询登记测试企业信息(文件审核页面)
 */
router.get('/getRegistrationManagerInfo', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await service.getRegistrationManagerInfo(
    registrationUuid
  );

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
 * 查询登记测试企业信息(文件审核页面)
 */
router.get(
  '/selectEnterpriseInfoByFileDownloadRegistrationUuid',
  async (ctx, next) => {
    const { registrationUuid } = ctx.state.param;

    const data = await service.selectEnterpriseInfoByFileDownloadRegistrationUuid(
      registrationUuid
    );

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
  }
);

/**
 * 获取软件著作权证书的信息
 */
router.get('/getRegistrationFileByFileDownloadRegistrationUuid', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await service.getRegistrationFileByFileDownloadRegistrationUuid({
    registrationUuid
  });

  if (data) {
    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } else {
    ctx.body = new Res({
      status: RESPONSE_CODE.error
    });
  }
});

export default router;
