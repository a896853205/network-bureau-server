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
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.getRegistrationManagerInfo(registrationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    console.error(error);
    ctx.throw(RESPONSE_CODE.error, '查询失败');
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
        status: RESPONSE_CODE.error
      });
    }
  }
);

router.get('/downloadProduct', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.downloadProduct(registrationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    console.error(error);
    ctx.throw(RESPONSE_CODE.error, '查询失败');
  }
});

router.get('/downloadProductDescription', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.downloadProductDescription(registrationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    console.error(error);
    ctx.throw(RESPONSE_CODE.error, '查询失败');
  }
});

router.get('/downloadDocument', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.downloadDocument(registrationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    console.error(error);
    ctx.throw(RESPONSE_CODE.error, '查询失败');
  }
});

router.get('/downloadCopyright', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.downloadCopyright(registrationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    console.error(error);
    ctx.throw(RESPONSE_CODE.error, '查询失败');
  }
});

/**
 * 管理员下载合同word
 */
router.get('/downloadContract', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.downloadContract(registrationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    ctx.throw(RESPONSE_CODE.error, '目前状态不可以生成合同或出现错误');
  }
});

export default router;
