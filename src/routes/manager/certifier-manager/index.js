import Router from 'koa-router';
import Res from '../../../util/response';
import { RESPONSE_CODE } from '../../../constants/domain-constants';

// 权限
import { AUTHORITY } from '../../../constants/role-constants';

// services
import service from '../../../service';

const router = new Router({
  prefix: AUTHORITY.CERTIFIER.router
});

/**
 * 批准人查找注册登记信息
 */
router.get('/quaryRegistratiomNeedCertified', async (ctx, next) => {
  try {
    const { page } = ctx.state.param;
    const certifierManagerUuid = ctx.state.user.uuid;

    const data = await service.quaryRegistratiomNeedCertified({
      page,
      certifierManagerUuid
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
 * 批准人查找注册登记管理员
 */
router.get('/selectCertifierRegistration', async ctx => {
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
 * 批准人根据registrationUuid查询具体步骤
 */
router.get('/queryCertifierEnterpriseRegistrationStep', async (ctx, next) => {
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
 * 批准人查询样品文档集的基本信息
 */
router.get('/getCertifierRegistrationTestSpecimen', async (ctx, next) => {
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
 * 批准人查询现场测试申请表的基本信息
 */
router.get('/getCertifierRegistrationTestApply', async (ctx, next) => {
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
 * 批准人设置现场申请表审核通过状态
 */
router.post('/setCertifierApplyManagerStatus', async (ctx, next) => {
  try {
    const { registrationUuid } = ctx.state.param;

    const certifierManagerUuid = ctx.state.user.uuid;
    await service.setCertifierApplyManagerStatus({
      registrationUuid,
      certifierManagerUuid
    });

    ctx.body = new Res({
      status: RESPONSE_CODE.success
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 批准人设置现场申请表审核不通过状态
 */
router.post('/setCertifierApplyManagerFailStatus', async (ctx, next) => {
  try {
    const { registrationUuid, failManagerText } = ctx.state.param;

    await service.setCertifierApplyManagerFailStatus({
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
router.get('/getCertifierRegistrationRecordStatus', async ctx => {
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
router.get('/getCertifierRegistrationReportStatus', async ctx => {
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
router.get('/getCertifierRegistrationRecord', async ctx => {
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
 * 设置原始记录成功状态
 */
router.put(
  '/setCertifierRegistrationRecordSuccessStatus',
  async (ctx, next) => {
    try {
      const { registrationUuid } = ctx.state.param;
      const certifierManagerUuid = ctx.state.user.uuid;

      await service.setCertifierRegistrationRecordSuccessStatus({
        certifierManagerUuid,
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
 * 设置原始记录失败状态
 */
router.put('/setCertifierRegistrationRecordFailStatus', async ctx => {
  try {
    const { registrationUuid, failText } = ctx.state.param;

    await service.setCertifierRegistrationRecordFailStatus({
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
 * 查询现场报告的基本信息
 */
router.get('/getCertifierRegistrationReport', async ctx => {
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
 * 设置现场报告成功状态
 */
router.put(
  '/setCertifierRegistrationReportSuccessStatus',
  async (ctx, next) => {
    try {
      const { registrationUuid } = ctx.state.param;
      const certifierManagerUuid = ctx.state.user.uuid;

      await service.setCertifierRegistrationReportSuccessStatus({
        certifierManagerUuid,
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
 * 设置现场报告失败状态
 */
router.put('/setCertifierRegistrationReportFailStatus', async ctx => {
  try {
    const { registrationUuid, failText } = ctx.state.param;

    await service.setCertifierRegistrationReportFailStatus({
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
 * 批准人查找注册登记信息
 */
router.get('/quaryDelegationNeedCertified', async (ctx, next) => {
  try {
    const { page } = ctx.state.param;
    const certifierManagerUuid = ctx.state.user.uuid;

    const data = await service.quaryDelegationNeedCertified({
      page,
      certifierManagerUuid
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
 * 批准人查找注册登记管理员
 */
router.get('/selectCertifierDelegation', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.selectDelegationByDelegationUuid(
      delegationUuid
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
 * 批准人根据delegationUuid查询具体步骤
 */
router.get('/queryCertifierEnterpriseDelegationStep', async (ctx, next) => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.queryEnterpriseDelegationStepByDelegationUuid(
      delegationUuid
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
 * 批准人查询样品文档集的基本信息
 */
router.get('/getCertifierDelegationTestSpecimen', async (ctx, next) => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.getDelegationTestSpecimen(delegationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 批准人查询现场测试申请表的基本信息
 */
router.get('/getCertifierDelegationTestApply', async (ctx, next) => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.getDelegationTestApply(delegationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 批准人设置现场申请表审核通过状态
 */
router.post('/setDelegationCertifierApplyManagerStatus', async (ctx, next) => {
  try {
    const { delegationUuid } = ctx.state.param;

    const certifierManagerUuid = ctx.state.user.uuid;
    await service.setDelegationCertifierApplyManagerStatus({
      delegationUuid,
      certifierManagerUuid
    });

    ctx.body = new Res({
      status: RESPONSE_CODE.success
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 批准人设置现场申请表审核不通过状态
 */
router.post('/setDelegationCertifierApplyManagerFailStatus', async (ctx, next) => {
  try {
    const { delegationUuid, failManagerText } = ctx.state.param;

    await service.setDelegationCertifierApplyManagerFailStatus({
      delegationUuid,
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
router.get('/getCertifierDelegationRecordStatus', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.getDelegationRecordStatus(delegationUuid);

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
router.get('/getCertifierDelegationReportStatus', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.getDelegationReportStatus(delegationUuid);

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
router.get('/getCertifierDelegationRecord', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.getManagerDelegationRecord(delegationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 设置原始记录成功状态
 */
router.put(
  '/setCertifierDelegationRecordSuccessStatus',
  async (ctx, next) => {
    try {
      const { delegationUuid } = ctx.state.param;
      const certifierManagerUuid = ctx.state.user.uuid;

      await service.setCertifierDelegationRecordSuccessStatus({
        certifierManagerUuid,
        delegationUuid
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
 * 设置原始记录失败状态
 */
router.put('/setCertifierDelegationRecordFailStatus', async ctx => {
  try {
    const { delegationUuid, failText } = ctx.state.param;

    await service.setCertifierDelegationRecordFailStatus({
      delegationUuid,
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
 * 查询现场报告的基本信息
 */
router.get('/getCertifierDelegationReport', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.getManagerDelegationReport(delegationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 设置现场报告成功状态
 */
router.put(
  '/setCertifierDelegationReportSuccessStatus',
  async (ctx, next) => {
    try {
      const { delegationUuid } = ctx.state.param;
      const certifierManagerUuid = ctx.state.user.uuid;

      await service.setCertifierDelegationReportSuccessStatus({
        certifierManagerUuid,
        delegationUuid
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
 * 设置现场报告失败状态
 */
router.put('/setCertifierDelegationReportFailStatus', async ctx => {
  try {
    const { delegationUuid, failText } = ctx.state.param;

    await service.setCertifierDelegationReportFailStatus({
      delegationUuid,
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
