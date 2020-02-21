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
  try {
    const { page } = ctx.state.param;
    const managerUuid = ctx.state.user.uuid;

    const data = await service.queryRegistrationNeedAssigned({
      page,
      managerUuid
    });

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 查询技术人员
 */
router.get('/queryTechManager', async (ctx, next) => {
  try {
    const { page } = ctx.state.param;

    const data = await service.queryTechManager(page);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 更新技术人员
 */
router.post('/arrangeTechManager', async (ctx, next) => {
  try {
    const { registrationUuid, techManagerUuid } = ctx.state.param;

    await service.arrangeTechManager({
      registrationUuid,
      techManagerUuid
    });
    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      msg: '已选择技术人员'
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 根据registrationUuid查询具体步骤
 */
router.get('/queryTechLeaderEnterpriseRegistrationStep', async (ctx, next) => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.queryEnterpriseRegistrationStepByRegistrationUuid(
      registrationUuid
    );

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 查询登记测试技术人员uuid
 */
router.get('/selectRegistrationTechManagerUuid', async (ctx, next) => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.selectRegistrationTechManagerUuid(
      registrationUuid
    );

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 查询登记测试管理员信息(文件审核页面)
 */
router.get('/selectRegistrationManagerUuid', async (ctx, next) => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.selectRegistrationByRegistrationUuid(
      registrationUuid
    );

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
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
    throw error;
  }
});

/**
 * 查询登记测试企业信息(文件审核页面)
 */
router.get(
  '/selectEnterpriseInfoByFileDownloadRegistrationUuid',
  async (ctx, next) => {
    try {
      const { registrationUuid } = ctx.state.param;

      const data = await service.selectEnterpriseInfoByFileDownloadRegistrationUuid(
        registrationUuid
      );

      ctx.body = new Res({
        status: RESPONSE_CODE.success,
        data
      });
    } catch (error) {
      throw error;
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
    throw error;
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
    throw error;
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
    throw error;
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
    throw error;
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
    throw error;
  }
});

router.get('/selectTechLeaderRegistration', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;
    
    const data = await service.selectRegistrationByRegistrationUuid(
      registrationUuid
    );

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

export default router;
