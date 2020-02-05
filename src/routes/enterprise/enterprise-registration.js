import Router from 'koa-router';

// response
import Res from '../../util/response';
import { RESPONSE_CODE } from '../../constants/domain-constants';

// service
import enterpriseRegistrationService from '../../service/enterprise/enterprise-registration-service';
import managerUserService from '../../service/manager/manager-user-service';

const router = new Router({
  prefix: '/enterpriseRegistration'
});

router.post('/createEnterpriseRegistration', async (ctx, next) => {
  const { uuid: enterpriseUuid } = ctx.state.user,
    { name } = ctx.state.param;

  const data = await enterpriseRegistrationService.createEnterpriseRegistration(
    name,
    enterpriseUuid
  );

  if (data) {
    ctx.body = new Res({
      data,
      status: RESPONSE_CODE.success,
      msg: '登录测试创建成功'
    });
  } else {
    ctx.body = new Res({
      status: RESPONSE_CODE.error,
      msg: '登录测试名称重复'
    });
  }
});

/**
 * 查询企业的登记测试列表
 */
router.get('/queryRegistration', async (ctx, next) => {
  const { uuid: enterpriseUuid } = ctx.state.user,
    { page } = ctx.state.param;

  const data = await enterpriseRegistrationService.queryRegistrationByEnterpriseUuid(
    enterpriseUuid,
    page
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
router.get('/selectRegistration', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await enterpriseRegistrationService.selectRegistrationByRegistrationUuid(
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
 * 查询企业用户登记测试七个状态通过registrationUuid
 */
router.get('/selectRegistrationStatus', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await enterpriseRegistrationService.selectRegistrationStatusByRegistrationUuid(
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
 * 根据registrationUuid查询具体步骤
 */
router.get('/queryEnterpriseRegistrationStep', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await enterpriseRegistrationService.queryEnterpriseRegistrationStepByRegistrationUuid(
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
 * 无参数查询sys_registration_step表
 */
router.get('/querySysRegistrationStep', async (ctx, next) => {
  const data = await enterpriseRegistrationService.querySysRegistrationStep();

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
 * 获取管理员信息
 */
router.get('/selectManagerInfo', async (ctx, next) => {
  const { managerUuid } = ctx.state.param;

  const data = await managerUserService.getManagerByManagerUuid(managerUuid);

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

/**
 * 查询登记测试的基本信息
 */
router.get('/selectRegistrationBasic', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await enterpriseRegistrationService.selectRegistrationBasicByRegistrationUuid(
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
});

/**
 * 保存登记测试的基本信息
 */
router.post('/saveRegistrationBasic', async (ctx, next) => {
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

  const data = await enterpriseRegistrationService.saveRegistrationBasic({
    registrationUuid,
    version,
    linkman,
    client,
    phone,
    address,
    devStartTime,
    enterpriseName
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

/**
 * 查询评测合同的基本信息
 */
router.get('/selectRegistrationContract', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await enterpriseRegistrationService.selectRegistrationContractByRegistrationUuid(
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
});

/**
 * 保存评测合同的基本信息
 */
router.post('/saveRegistrationContract', async (ctx, next) => {
  const {
    registrationUuid,
    amount,
    fax,
    postalCode,
    mainFunction,
    techIndex
  } = ctx.state.param;

  const data = await enterpriseRegistrationService.saveRegistrationContract({
    registrationUuid,
    amount,
    fax,
    postalCode,
    mainFunction,
    techIndex
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

/**
 * 查询样品登记表的基本信息
 */
router.get('/selectRegistrationSpecimen', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await enterpriseRegistrationService.selectRegistrationSpecimenByRegistrationUuid(
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
});

/**
 * 保存样品登记表的基本信息
 */
router.post('/saveRegistrationSpecimen', async (ctx, next) => {
  const {
    registrationUuid,
    trademark,
    developmentTool,
    securityClassification,
    email,
    unit
  } = ctx.state.param;

  const data = await enterpriseRegistrationService.saveRegistrationSpecimen({
    registrationUuid,
    trademark,
    developmentTool,
    securityClassification,
    email,
    unit
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

/**
 * 查询现场测试申请表的基本信息
 */
router.get('/selectRegistrationApply', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await enterpriseRegistrationService.selectRegistrationApplyByRegistrationUuid(
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
});

/**
 * 保存现场测试申请表的基本信息
 */
router.post('/saveRegistrationApply', async (ctx, next) => {
  const { registrationUuid, content } = ctx.state.param;

  const data = await enterpriseRegistrationService.saveRegistrationApply({
    registrationUuid,
    content
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

/**
 * 获取软件著作权的信息
 */
router.get('/selectRegistrationCopyright', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await enterpriseRegistrationService.selectRegistrationCopyright({
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

/**
 * 保存软件著作权的信息
 */
router.post('/saveRegistrationCopyright', async (ctx, next) => {
  const { registrationUuid, copyrightUrl } = ctx.state.param;

  const data = await enterpriseRegistrationService.saveRegistrationCopyright({
    registrationUuid,
    copyrightUrl
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

/**
 * 获取用户文档集的信息
 */
router.get('/selectRegistrationDocument', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await enterpriseRegistrationService.selectRegistrationDocument({
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

/**
 * 保存用户文档集的信息
 */
router.post('/saveRegistrationDocument', async (ctx, next) => {
  const { registrationUuid, documentUrl } = ctx.state.param;

  const data = await enterpriseRegistrationService.saveRegistrationDocument({
    registrationUuid,
    documentUrl
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

/**
 * 获取产品说明的信息
 */
router.get('/selectRegistrationProductDescription', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await enterpriseRegistrationService.selectRegistrationProductDescription({
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

/**
 * 保存产品说明的信息
 */
router.post('/saveRegistrationProductDescription', async (ctx, next) => {
  const { registrationUuid, productDescriptionUrl } = ctx.state.param;

  const data = await enterpriseRegistrationService.saveRegistrationProductDescription({
    registrationUuid,
    productDescriptionUrl
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

/**
 * 获取产品介质的信息
 */
router.get('/selectRegistrationProduct', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await enterpriseRegistrationService.selectRegistrationProduct({
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

/**
 * 保存产品介质的信息
 */
router.post('/saveRegistrationProduct', async (ctx, next) => {
  const { registrationUuid, productUrl } = ctx.state.param;

  const data = await enterpriseRegistrationService.saveRegistrationProduct({
    registrationUuid,
    productUrl
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

/**
 * 查询经管部门填写评测合同的基本信息
 */
router.get('/selectContractManager', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await enterpriseRegistrationService.selectRegistrationContractManager(
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
});

/**
 * 查询评测合同甲方上传pdf合同的信息
 */
router.get('/selectManagerContractUrl', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await enterpriseRegistrationService.selectManagerContractUrl(
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
});

/**
 * 保存评测合同乙方上传pdf合同的信息
 */
router.post('/saveEnterpriseContractUrl', async (ctx, next) => {
  const { registrationUuid, enterpriseUrl } = ctx.state.param;

  const data = await enterpriseRegistrationService.saveEnterpriseContractUrl({
    registrationUuid,
    enterpriseUrl
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

/**
 * 查询评测合同乙方上传pdf合同的信息
 */
router.get('/selectEnterpriseContractUrl', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await enterpriseRegistrationService.selectEnterpriseContractUrl(
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
});


export default router;
