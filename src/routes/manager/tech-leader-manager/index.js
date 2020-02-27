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

/**
 * 技术负责人查询样品文档集的基本信息
 */
router.get('/getTechLeaderRegistrationTestSpecimen', async (ctx, next) => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.getRegistrationTestSpecimen(registrationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 技术负责人查询现场测试申请表的基本信息
 */
router.get('/getTechLeaderRegistrationTestApply', async (ctx, next) => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.getRegistrationTestApply(registrationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 技术负责人设置现场申请表审核通过状态
 */
router.post('/setTechLeaderApplyManagerStatus', async (ctx, next) => {
  try {
    const { registrationUuid } = ctx.state.param;

    await service.setTechLeaderApplyManagerStatus(registrationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 技术负责人设置现场申请表审核不通过状态
 */
router.post('/setTechLeaderApplyManagerFailStatus', async (ctx, next) => {
  try {
    const { registrationUuid, failManagerText } = ctx.state.param;

    await service.setTechLeaderApplyManagerFailStatus({
      registrationUuid,
      failManagerText
    });

    ctx.body = new Res({
      status: RESPONSE_CODE.success
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 查询原始记录状态信息
 */
router.get('/getTechLeaderRegistrationRecordStatus', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.getRegistrationRecordStatus(registrationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 查询现场报告信息
 */
router.get('/getTechLeaderRegistrationReportStatus', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.getRegistrationReportStatus(registrationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 查询原始记录的基本信息
 */
router.get('/getTechLeaderRegistrationRecord', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.getManagerRegistrationRecord(registrationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 设置第二步合同签署成功状态
 */
router.put(
  '/setTechLeaderRegistrationRecordSuccessStatus',
  async (ctx, next) => {
    try {
      const { registrationUuid } = ctx.state.param;
      const techLeaderManagerUuid = ctx.state.user.uuid;

      await service.setTechLeaderRegistrationRecordSuccessStatus({
        techLeaderManagerUuid,
        registrationUuid
      });

      ctx.body = new Res({
        status: RESPONSE_CODE.success
      });
    } catch (error) {
      throw error;
    }
  }
);

/**
 * 设置第二步合同签署失败状态
 */
router.post('/setTechLeaderRegistrationRecordFailStatus', async ctx => {
  try {
    const { registrationUuid, failText } = ctx.state.param;

    await service.setTechLeaderRegistrationRecordFailStatus({
      registrationUuid,
      failText
    });

    ctx.body = new Res({
      status: RESPONSE_CODE.success
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 查询原始记录的基本信息
 */
router.get('/getTechLeaderRegistrationReport', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.getManagerRegistrationReport(registrationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 设置第二步合同签署成功状态
 */
router.put(
  '/setTechLeaderRegistrationReportSuccessStatus',
  async (ctx, next) => {
    try {
      const { registrationUuid } = ctx.state.param;
      const techLeaderManagerUuid = ctx.state.user.uuid;

      await service.setTechLeaderRegistrationReportSuccessStatus({
        techLeaderManagerUuid,
        registrationUuid
      });

      ctx.body = new Res({
        status: RESPONSE_CODE.success
      });
    } catch (error) {
      throw error;
    }
  }
);

/**
 * 设置第二步合同签署失败状态
 */
router.put('/setTechLeaderRegistrationReportFailStatus', async ctx => {
  try {
    const { registrationUuid, failText } = ctx.state.param;

    await service.setTechLeaderRegistrationReportFailStatus({
      registrationUuid,
      failText
    });

    ctx.body = new Res({
      status: RESPONSE_CODE.success
    });
  } catch (error) {
    throw error;
  }
});

export default router;
