import Router from 'koa-router';

// response
import Res from '../../util/response';
import { RESPONSE_CODE } from '../../constants/domain-constants';

// service
import service from '../../service';

// 权限
import { AUTHORITY } from '../../constants/role-constants';

const router = new Router({
  prefix: AUTHORITY.ENTERPRISE.router
});

router.post('/createEnterpriseDelegation', async ctx => {
  try {
    const { uuid: enterpriseUuid } = ctx.state.user,
      { name } = ctx.state.param;

    const data = await service.createEnterpriseDelegation(
      name,
      enterpriseUuid
    );

    ctx.body = new Res({
      data,
      status: RESPONSE_CODE.success,
      msg: '登录测试创建成功'
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 查询企业的登记测试列表
 */
router.get('/queryDelegation', async ctx => {
  try {
    const { uuid: enterpriseUuid } = ctx.state.user,
      { page } = ctx.state.param;

    const data = await service.queryDelegationByEnterpriseUuid(
      enterpriseUuid,
      page
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
 * 查询登记测试信息(单独)
 */
router.get('/selectDelegation', async ctx => {
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
 * 查询企业用户登记测试七个状态通过delegationUuid
 */
router.get('/selectDelegationStatus', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.selectDelegationStatusByDelegationUuid(
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
router.get('/queryEnterpriseDelegationStep', async ctx => {
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
 * 无参数查询sys_delegation_step表
 */
router.get('/querySysDelegationStep', async ctx => {
  try {
    const data = await service.querySysDelegationStep();

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 获取管理员信息
 */
router.get('/selectDelegationManagerInfo', async ctx => {
  try {
    const { managerUuid } = ctx.state.param;

    const data = await service.selectDelegationManagerByManagerUuid(managerUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 查询登记测试的基本信息
 */
router.get('/selectDelegationBasic', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.selectDelegationBasicByDelegationUuid(
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
 * 保存登记测试的基本信息
 */
router.post('/saveDelegationBasic', async ctx => {
  try {
    const {
      delegationUuid,
      version,
      linkman,
      client,
      phone,
      address,
      devStartTime,
      enterpriseName
    } = ctx.state.param;

    const data = await service.saveDelegationBasic({
      delegationUuid,
      version,
      linkman,
      client,
      phone,
      address,
      devStartTime,
      enterpriseName
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
 * 查询评测合同的基本信息
 */
router.get('/selectDelegationContract', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.selectDelegationContractByDelegationUuid(
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
 * 保存评测合同的基本信息
 */
router.post('/saveDelegationContract', async ctx => {
  try {
    const {
      delegationUuid,
      amount,
      postalCode,
      mainFunction,
      techIndex
    } = ctx.state.param;

    const data = await service.saveDelegationContract({
      delegationUuid,
      amount,
      postalCode,
      mainFunction,
      techIndex
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
 * 查询样品登记表的基本信息
 */
router.get('/selectDelegationSpecimen', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.selectDelegationSpecimenByDelegationUuid(
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
 * 保存样品登记表的基本信息
 */
router.post('/saveDelegationSpecimen', async ctx => {
  try {
    const {
      delegationUuid,
      trademark,
      developmentTool,
      securityClassification,
      email,
      unit
    } = ctx.state.param;

    const data = await service.saveDelegationSpecimen({
      delegationUuid,
      trademark,
      developmentTool,
      securityClassification,
      email,
      unit
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
 * 查询现场测试申请表的基本信息
 */
router.get('/selectDelegationApply', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.selectDelegationApplyByDelegationUuid(
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
 * 保存现场测试申请表的基本信息
 */
router.post('/saveDelegationApply', async ctx => {
  try {
    const { delegationUuid, content } = ctx.state.param;

    const data = await service.saveDelegationApply({
      delegationUuid,
      content
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
 * 获取软件著作权的信息
 */
router.get('/selectDelegationCopyright', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.selectDelegationCopyright({
      delegationUuid
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
 * 保存软件著作权的信息
 */
router.post('/saveDelegationCopyright', async ctx => {
  try {
    const { delegationUuid, copyrightUrl } = ctx.state.param;

    const data = await service.saveDelegationCopyright({
      delegationUuid,
      copyrightUrl
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
 * 获取用户文档集的信息
 */
router.get('/selectDelegationDocument', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.selectDelegationDocument({
      delegationUuid
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
 * 保存用户文档集的信息
 */
router.post('/saveDelegationDocument', async ctx => {
  try {
    const { delegationUuid, documentUrl } = ctx.state.param;

    const data = await service.saveDelegationDocument({
      delegationUuid,
      documentUrl
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
 * 获取产品说明的信息
 */
router.get('/selectDelegationProductDescription', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.selectDelegationProductDescription({
      delegationUuid
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
 * 保存产品说明的信息
 */
router.post('/saveDelegationProductDescription', async ctx => {
  try {
    const { delegationUuid, productDescriptionUrl } = ctx.state.param;

    const data = await service.saveDelegationProductDescription({
      delegationUuid,
      productDescriptionUrl
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
 * 获取样品的信息
 */
router.get('/selectDelegationProduct', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.selectDelegationProduct({
      delegationUuid
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
 * 保存样品的信息
 */
router.post('/saveDelegationProduct', async ctx => {
  try {
    const { delegationUuid, productUrl } = ctx.state.param;

    const data = await service.saveDelegationProduct({
      delegationUuid,
      productUrl
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
 * 查询第二步合同签署步骤
 */
router.get('/selectDelegationContractManagerFailText', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.selectDelegationContractManagerFailText(delegationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 查询评测合同的路由
 */
router.get('/selectDelegationContractUrl', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.selectDelegationContractUrl(delegationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 保存评测合同乙方上传pdf合同的信息
 */
router.post('/saveDelegationEnterpriseContractUrl', async ctx => {
  try {
    const { delegationUuid, enterpriseUrl } = ctx.state.param;

    await service.saveDelegationEnterpriseContractUrl({
      delegationUuid,
      enterpriseUrl
    });

    ctx.body = new Res({
      status: RESPONSE_CODE.success
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 更新交付汇款的状态
 */
router.put('/noticeDelegationAccountPayment', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.noticeDelegationAccountPayment(delegationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 现场测试阶段查询现场测试申请表的基本信息
 */
router.get('/selectTestDelegationApply', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.selectTestDelegationApplyByDelegationUuid(
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
 * 现场测试阶段查询样品登记表的基本信息
 */
router.get('/selectTestDelegationSpecimen', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.selectTestDelegationSpecimenByDelegationUuid(
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
 * 现场测试阶段保存现场测试申请表的基本信息
 */
router.post('/saveTestDelegationApply', async ctx => {
  try {
    const { delegationUuid, content } = ctx.state.param;

    const data = await service.saveTestDelegationApply({
      delegationUuid,
      content
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
 * 现场测试阶段保存样品登记表的基本信息
 */
router.post('/saveTestDelegationSpecimen', async ctx => {
  try {
    const {
      delegationUuid,
      trademark,
      developmentTool,
      securityClassification,
      email,
      unit
    } = ctx.state.param;

    const data = await service.saveTestDelegationSpecimen({
      delegationUuid,
      trademark,
      developmentTool,
      securityClassification,
      email,
      unit
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
 * 查找原始记录url
 */
router.get('/selectEnterpriseDelegationRecord', async (ctx, next) => {
  try {
    const { delegationUuid } = ctx.state.param;
    const data = await service.selectEnterpriseDelegationRecord(
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
 * 查找现场报告url
 */
router.get('/selectEnterpriseDelegationReport', async (ctx, next) => {
  try {
    const { delegationUuid } = ctx.state.param;
    const data = await service.selectEnterpriseDelegationReport(
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
 * 企业点击提交8种信息
 */
router.post('/submitDelegationAllFile', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.submitDelegationAllFile({ delegationUuid });

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});


/**
 * 下载合同word
 */
router.get('/downloadDelegationContractWord', async ctx => {
  try {
    const { delegationUuid } = ctx.state.param;

    const data = await service.generateDelegationContractWord(delegationUuid);

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

export default router;
