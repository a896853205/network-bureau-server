import Router from 'koa-router';

// response
import Res from '../../util/response';
import { RESPONSE_CODE } from '../../constants/domain-constants';

// service
import service from '../../service';

const router = new Router({
  prefix: '/enterprise'
});

router.post('/createEnterpriseRegistration', async (ctx, next) => {
  const { uuid: enterpriseUuid } = ctx.state.user,
    { name } = ctx.state.param;

  const data = await service.createEnterpriseRegistration(name, enterpriseUuid);

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

  const data = await service.queryRegistrationByEnterpriseUuid(
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
 * 查询企业用户登记测试七个状态通过registrationUuid
 */
router.get('/selectRegistrationStatus', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await service.selectRegistrationStatusByRegistrationUuid(
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
 * 无参数查询sys_registration_step表
 */
router.get('/querySysRegistrationStep', async (ctx, next) => {
  const data = await service.querySysRegistrationStep();

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

  const data = await service.getManagerByManagerUuid(managerUuid);

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

  const data = await service.selectRegistrationBasicByRegistrationUuid(
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

  const data = await service.selectRegistrationContractByRegistrationUuid(
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

  const data = await service.saveRegistrationContract({
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

  const data = await service.selectRegistrationSpecimenByRegistrationUuid(
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

  const data = await service.saveRegistrationSpecimen({
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

  const data = await service.selectRegistrationApplyByRegistrationUuid(
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

  const data = await service.saveRegistrationApply({
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

  const data = await service.selectRegistrationCopyright({
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

  const data = await service.saveRegistrationCopyright({
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

  const data = await service.selectRegistrationDocument({
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

  const data = await service.saveRegistrationDocument({
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

  const data = await service.selectRegistrationProductDescription({
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

  const data = await service.saveRegistrationProductDescription({
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

  const data = await service.selectRegistrationProduct({
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

  const data = await service.saveRegistrationProduct({
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
 * 查询第二步合同签署步骤
 */
router.get('/selectContractManagerFailText', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await service.selectContractManagerFailText(registrationUuid);

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
 * 查询评测合同的路由
 */
router.get('/selectContractUrl', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await service.selectContractUrl(registrationUuid);

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

  const data = await service.saveEnterpriseContractUrl({
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
 * 更新交付汇款的状态
 */
router.put('/noticeAccountPayment', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await service.noticeAccountPayment(registrationUuid);

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
