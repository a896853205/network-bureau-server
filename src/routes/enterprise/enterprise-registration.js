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

router.post('/createEnterpriseRegistration', async ctx => {
  try {
    const { uuid: enterpriseUuid } = ctx.state.user,
      { name } = ctx.state.param;

    const data = await service.createEnterpriseRegistration(
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
router.get('/queryRegistration', async ctx => {
  try {
    const { uuid: enterpriseUuid } = ctx.state.user,
      { page } = ctx.state.param;

    const data = await service.queryRegistrationByEnterpriseUuid(
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
router.get('/selectRegistration', async ctx => {
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
 * 查询企业用户登记测试七个状态通过registrationUuid
 */
router.get('/selectRegistrationStatus', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.selectRegistrationStatusByRegistrationUuid(
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
router.get('/queryEnterpriseRegistrationStep', async ctx => {
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
 * 无参数查询sys_registration_step表
 */
router.get('/querySysRegistrationStep', async ctx => {
  try {
    const data = await service.querySysRegistrationStep();

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
router.get('/selectManagerInfo', async ctx => {
  try {
    const { managerUuid } = ctx.state.param;

    const data = await service.selectManagerByManagerUuid(managerUuid);

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
router.get('/selectRegistrationBasic', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.selectRegistrationBasicByRegistrationUuid(
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
 * 保存登记测试的基本信息
 */
router.post('/saveRegistrationBasic', async ctx => {
  try {
    const {
      registrationUuid,
      version,
      linkman,
      client,
      phone,
      address,
      devStartTime,
      enterpriseName
    } = ctx.state.param;

    const data = await service.saveRegistrationBasic({
      registrationUuid,
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
router.get('/selectRegistrationContract', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.selectRegistrationContractByRegistrationUuid(
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
 * 保存评测合同的基本信息
 */
router.post('/saveRegistrationContract', async ctx => {
  try {
    const {
      registrationUuid,
      amount,
      postalCode,
      mainFunction,
      techIndex
    } = ctx.state.param;

    const data = await service.saveRegistrationContract({
      registrationUuid,
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
router.get('/selectRegistrationSpecimen', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.selectRegistrationSpecimenByRegistrationUuid(
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
 * 保存样品登记表的基本信息
 */
router.post('/saveRegistrationSpecimen', async ctx => {
  try {
    const {
      registrationUuid,
      trademark,
      developmentTool,
      securityClassification,
      email,
      unit
    } = ctx.state.param;

    const data = await service.saveRegistrationSpecimen({
      registrationUuid,
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
router.get('/selectRegistrationApply', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.selectRegistrationApplyByRegistrationUuid(
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
 * 保存现场测试申请表的基本信息
 */
router.post('/saveRegistrationApply', async ctx => {
  try {
    const { registrationUuid, content } = ctx.state.param;

    const data = await service.saveRegistrationApply({
      registrationUuid,
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
router.get('/selectRegistrationCopyright', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.selectRegistrationCopyright({
      registrationUuid
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
router.post('/saveRegistrationCopyright', async ctx => {
  try {
    const { registrationUuid, copyrightUrl } = ctx.state.param;

    const data = await service.saveRegistrationCopyright({
      registrationUuid,
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
router.get('/selectRegistrationDocument', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.selectRegistrationDocument({
      registrationUuid
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
router.post('/saveRegistrationDocument', async ctx => {
  try {
    const { registrationUuid, documentUrl } = ctx.state.param;

    const data = await service.saveRegistrationDocument({
      registrationUuid,
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
router.get('/selectRegistrationProductDescription', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.selectRegistrationProductDescription({
      registrationUuid
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
router.post('/saveRegistrationProductDescription', async ctx => {
  try {
    const { registrationUuid, productDescriptionUrl } = ctx.state.param;

    const data = await service.saveRegistrationProductDescription({
      registrationUuid,
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
router.get('/selectRegistrationProduct', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.selectRegistrationProduct({
      registrationUuid
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
router.post('/saveRegistrationProduct', async ctx => {
  try {
    const { registrationUuid, productUrl } = ctx.state.param;

    const data = await service.saveRegistrationProduct({
      registrationUuid,
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
router.get('/selectContractManagerFailText', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.selectContractManagerFailText(registrationUuid);

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
router.get('/selectContractUrl', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.selectContractUrl(registrationUuid);

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
router.post('/saveEnterpriseContractUrl', async ctx => {
  try {
    const { registrationUuid, enterpriseUrl } = ctx.state.param;

    await service.saveEnterpriseContractUrl({
      registrationUuid,
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
router.put('/noticeAccountPayment', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.noticeAccountPayment(registrationUuid);

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
router.get('/selectTestRegistrationApply', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.selectTestRegistrationApplyByRegistrationUuid(
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
 * 现场测试阶段查询样品登记表的基本信息
 */
router.get('/selectTestRegistrationSpecimen', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.selectTestRegistrationSpecimenByRegistrationUuid(
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
 * 现场测试阶段保存现场测试申请表的基本信息
 */
router.post('/saveTestRegistrationApply', async ctx => {
  try {
    const { registrationUuid, content } = ctx.state.param;

    const data = await service.saveTestRegistrationApply({
      registrationUuid,
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
router.post('/saveTestRegistrationSpecimen', async ctx => {
  try {
    const {
      registrationUuid,
      trademark,
      developmentTool,
      securityClassification,
      email,
      unit
    } = ctx.state.param;

    const data = await service.saveTestRegistrationSpecimen({
      registrationUuid,
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
router.get('/selectEnterpriseRegistrationRecord', async (ctx, next) => {
  try {
    const { registrationUuid } = ctx.state.param;
    const data = await service.selectEnterpriseRegistrationRecord(
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
 * 查找现场报告url
 */
router.get('/selectEnterpriseRegistrationReport', async (ctx, next) => {
  try {
    const { registrationUuid } = ctx.state.param;
    const data = await service.selectEnterpriseRegistrationReport(
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
 * 企业点击提交8种信息
 */
router.post('/submitAllFile', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.submitAllFile({ registrationUuid });

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

export default router;
