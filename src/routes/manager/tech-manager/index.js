import Router from 'koa-router';
import Res from '../../../util/response';
import { RESPONSE_CODE } from '../../../constants/domain-constants';

// 权限
import { AUTHORITY } from '../../../constants/role-constants';

// service
import service from '../../../service';

const router = new Router({
  prefix: AUTHORITY.TECH.router
});

/**
 * 技术人员查找注册登记信息
 */
router.get('/quaryRegistratiomNeedFieldTest', async (ctx, next) => {
  try {
    const { page } = ctx.state.param;
    const managerUuid = ctx.state.user.uuid;

    const data = await service.quaryRegistratiomNeedFieldTest({
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
 * 技术人员查询样品文档集的基本信息
 */
router.get('/getTechRegistrationTestSpecimen', async (ctx, next) => {
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
 * 技术人员查询现场测试申请表的基本信息
 */
router.get('/getTechRegistrationTestApply', async (ctx, next) => {
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
 * 设置现场申请表审核通过状态
 */
router.post('/setTechApplyManagerStatus', async (ctx, next) => {
  try {
    const { registrationUuid } = ctx.state.param;

    await service.setTechApplyManagerStatus(registrationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 设置现场申请表审核不通过状态
 */
router.post('/setTechApplyManagerFailStatus', async (ctx, next) => {
  try {
    const { registrationUuid, failManagerText } = ctx.state.param;

    await service.setTechApplyManagerFailStatus({
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
 * 设置样品登记表审核通过状态
 */
router.post('/setTechSpecimenManagerStatus', async (ctx, next) => {
  try {
    const { registrationUuid } = ctx.state.param;

    await service.setTechSpecimenManagerStatus(registrationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 设置样品登记表审核不通过状态
 */
router.post('/setTechSpecimenManagerFailStatus', async (ctx, next) => {
  try {
    const { registrationUuid, failManagerText } = ctx.state.param;

    await service.setTechSpecimenManagerFailStatus({
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
 * 查询登记测试信息(单独)
 */
router.get('/selectTechRegistration', async (ctx, next) => {
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
 * 根据registrationUuid查询具体步骤
 */
router.get('/queryTechEnterpriseRegistrationStep', async (ctx, next) => {
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
 * 生成报告模板
 */
router.get('/generateReportWord', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.generateReportWord(registrationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 生成原始记录模板
 */
router.get('/generateRecordWord', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.generateRecordWord(registrationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 查询现场记录信息
 */
router.get('/selectTechRegistrationRecord', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.selectRegistrationRecordByRegistrationUuid(
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
 * 保存现场记录信息
 */
router.post('/saveTechRegistrationRecord', async ctx => {
  try {
    const { registrationUuid, url, totalPage } = ctx.state.param;
    const techManagerUuid = ctx.state.user.uuid;

    const data = await service.saveTechRegistrationRecord({
      registrationUuid,
      url,
      totalPage,
      techManagerUuid
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
 * 查询现场报告信息
 */
router.get('/selectTechRegistrationReport', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.selectRegistrationReportByRegistrationUuid(
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
 * 保存现场报告信息
 */
router.post('/saveTechRegistrationReport', async ctx => {
  try {
    const { registrationUuid, url, totalPage } = ctx.state.param;
    const techManagerUuid = ctx.state.user.uuid;

    const data = await service.saveTechRegistrationReport({
      registrationUuid,
      url,
      totalPage,
      techManagerUuid
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
 * 查询原始记录状态信息
 */
router.get('/getTechRegistrationRecordStatus', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.getRegistrationRecordStatus(
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
 * 查询现场报告信息
 */
router.get('/getTechRegistrationReportStatus', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.getRegistrationReportStatus(
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

/**
 * 查询登记测试企业信息(企业评价页面)
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
 * 查询登记测试现场申请表信息
 */
router.get('/getRegistrationApplyInfo', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.selectRegistrationApplyByRegistrationUuid(registrationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 查询登记测试基本信息
 */
router.get('/getRegistrationBasicInfo', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.selectRegistrationBasicByRegistrationUuid(registrationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 查询登记测试样品登记表信息
 */
router.get('/getRegistrationSpecimenInfo', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.selectRegistrationSpecimenByRegistrationUuid(registrationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 查询登记测试合同信息
 */
router.get('/getRegistrationContractInfo', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.selectRegistrationContractByRegistrationUuid(registrationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 技术人员查找注册登记信息
 */
router.get('/quaryDelegationNeedFieldTest', async (ctx, next) => {
  try {
    const { page } = ctx.state.param;
    const managerUuid = ctx.state.user.uuid;

    const data = await service.quaryDelegationNeedFieldTest({
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
 * 技术人员查询样品文档集的基本信息
 */
router.get('/getTechDelegationTestSpecimen', async (ctx, next) => {
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
 * 技术人员查询现场测试申请表的基本信息
 */
router.get('/getTechDelegationTestApply', async (ctx, next) => {
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
 * 设置现场申请表审核通过状态
 */
router.post('/setDelegationTechApplyManagerStatus', async (ctx, next) => {
  try {
    const { delegationUuid } = ctx.state.param;

    await service.setDelegationTechApplyManagerStatus(delegationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 设置现场申请表审核不通过状态
 */
router.post('/setDelegationTechApplyManagerFailStatus', async (ctx, next) => {
  try {
    const { delegationUuid, failManagerText } = ctx.state.param;

    await service.setDelegationTechApplyManagerFailStatus({
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
 * 设置样品登记表审核通过状态
 */
router.post('/setDelegationTechSpecimenManagerStatus', async (ctx, next) => {
  try {
    const { delegationUuid } = ctx.state.param;

    await service.setDelegationTechSpecimenManagerStatus(delegationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 设置样品登记表审核不通过状态
 */
router.post('/setDelegationTechSpecimenManagerFailStatus', async (ctx, next) => {
  try {
    const { delegationUuid, failManagerText } = ctx.state.param;

    await service.setDelegationTechSpecimenManagerFailStatus({
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
 * 查询登记测试信息(单独)
 */
router.get('/selectTechDelegation', async (ctx, next) => {
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
 * 根据delegationUuid查询具体步骤
 */
router.get('/queryTechEnterpriseDelegationStep', async (ctx, next) => {
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
 * 生成报告模板
 */
router.get('/generateDelegationReportWord', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.generateDelegationReportWord(delegationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 生成原始记录模板
 */
router.get('/generateDelegationRecordWord', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.generateDelegationRecordWord(delegationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 查询现场记录信息
 */
router.get('/selectTechDelegationRecord', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.selectDelegationRecordByDelegationUuid(
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
 * 保存现场记录信息
 */
router.post('/saveTechDelegationRecord', async ctx => {
  try {
    const { delegationUuid, url, totalPage } = ctx.state.param;
    const techManagerUuid = ctx.state.user.uuid;

    const data = await service.saveTechDelegationRecord({
      delegationUuid,
      url,
      totalPage,
      techManagerUuid
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
 * 查询现场报告信息
 */
router.get('/selectTechDelegationReport', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.selectDelegationReportByDelegationUuid(
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
 * 保存现场报告信息
 */
router.post('/saveTechDelegationReport', async ctx => {
  try {
    const { delegationUuid, url, totalPage } = ctx.state.param;
    const techManagerUuid = ctx.state.user.uuid;

    const data = await service.saveTechDelegationReport({
      delegationUuid,
      url,
      totalPage,
      techManagerUuid
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
 * 查询原始记录状态信息
 */
router.get('/getTechDelegationRecordStatus', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.getDelegationRecordStatus(
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
 * 查询现场报告信息
 */
router.get('/getTechDelegationReportStatus', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.getDelegationReportStatus(
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
 * 查询登记测试企业信息(文件审核页面)
 */
router.get(
  '/selectEnterpriseInfoByFileDownloadDelegationUuid',
  async (ctx, next) => {
    try {
      const { delegationUuid } = ctx.state.param;

      const data = await service.selectEnterpriseInfoByFileDownloadDelegationUuid(
        delegationUuid
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

router.get('/downloadDelegationProduct', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.downloadDelegationProduct(delegationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

router.get('/downloadDelegationProductDescription', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.downloadDelegationProductDescription(delegationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

router.get('/downloadDelegationDocument', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.downloadDelegationDocument(delegationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

router.get('/downloadDelegationCopyright', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.downloadDelegationCopyright(delegationUuid);

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
router.get('/downloadDelegationContract', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.downloadDelegationContract(delegationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 查询登记测试企业信息(企业评价页面)
 */
router.get('/getDelegationManagerInfo', async (ctx, next) => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.getDelegationManagerInfo(delegationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 查询登记测试现场申请表信息
 */
router.get('/getDelegationApplyInfo', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.selectDelegationApplyByDelegationUuid(delegationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 查询登记测试基本信息
 */
router.get('/getDelegationBasicInfo', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.selectDelegationBasicByDelegationUuid(delegationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 查询登记测试样品登记表信息
 */
router.get('/getDelegationSpecimenInfo', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.selectDelegationSpecimenByDelegationUuid(delegationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 查询登记测试合同信息
 */
router.get('/getDelegationContractInfo', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.selectDelegationContractByDelegationUuid(delegationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

export default router;
