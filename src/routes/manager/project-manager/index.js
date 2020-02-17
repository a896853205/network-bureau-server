import Router from 'koa-router';
import Res from '../../../util/response';
import { RESPONSE_CODE } from '../../../constants/domain-constants';

// 权限
import { AUTHORITY } from '../../../constants/role-constants';

// service
import service from '../../../service';

const router = new Router({
  prefix: AUTHORITY.PROJECT_MANAGER.router
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
 * 查询企业的登记测试列表
 */
router.get('/queryRegistration', async (ctx, next) => {
  const { page } = ctx.state.param;

  const data = await service.queryRegistration(page);

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
 * 通过uuid查询企业基本信息
 */
router.get('/selectEnterpriseInfo', async (ctx, next) => {
  const { uuid } = ctx.state.param;

  const data = await service.getEnterpriseByUuid(uuid);

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
 * 查询企业用户登记测试8个文件
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
 * 查询样品文档集的基本信息
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
 * 设置审核通过状态
 */
router.post('/setRegistrationDetailSuccessStatus', async (ctx, next) => {
  const { registrationUuid, type } = ctx.state.param;

  const res = await service.setRegistrationDetailStatus({
    registrationUuid,
    type,
    isPass: true
  });

  if (res) {
    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data: res
    });
  } else {
    ctx.body = new Res({
      status: RESPONSE_CODE.error,
      msg: '查询失败'
    });
  }
});

/**
 * 设置内容错误状态
 */
router.post('/setRegistrationDetailFailStatus', async (ctx, next) => {
  const { registrationUuid, type, failText } = ctx.state.param;

  const res = await service.setRegistrationDetailStatus({
    registrationUuid,
    type,
    failText,
    isPass: false
  });

  if (res) {
    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data: res
    });
  } else {
    ctx.body = new Res({
      status: RESPONSE_CODE.error,
      msg: '查询失败'
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
 * 获取软件著作权证书的信息
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
 * 修改登记测试主流程进程修改
 */
router.post('/pushRegistrationProcess', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await service.pushRegistrationProcess(registrationUuid);

  if (data) {
    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      msg: '成功推进登记测试进度'
    });
  } else {
    ctx.body = new Res({
      status: RESPONSE_CODE.error,
      msg: '审核进度下一步失败,请检查各种信息是否全部审核通过'
    });
  }
});

/**
 * 查询经管部门填写评测合同的基本信息
 */
router.get('/selectRegistrationContractManager', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await service.selectRegistrationContractManager(
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
 * 保存经管部门填写评测合同的基本信息
 */
router.post('/saveRegistrationContractManager', async (ctx, next) => {
  const {
    registrationUuid,
    contractCode,
    specimenHaveTime,
    payment,
    paymentTime,
    contractTime
  } = ctx.state.param;

  const data = await service.saveRegistrationContractManager({
    registrationUuid,
    contractCode,
    specimenHaveTime,
    payment,
    paymentTime,
    contractTime
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
 * 管理员下载合同word
 */
router.get('/downloadContractWord', async ctx => {
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

/**
 * 保存评测合同甲方上传pdf合同的信息
 */
router.post('/saveManagerContractUrl', async (ctx, next) => {
  const { registrationUuid, managerUrl } = ctx.state.param;

  const data = await service.saveManagerContractUrl({
    registrationUuid,
    managerUrl
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
router.post('/updateFinanceManager', async (ctx, next) => {
  const { registrationUuid, financeManagerUuid } = ctx.state.param;

  const data = await service.updateFinanceManager({
    registrationUuid,
    financeManagerUuid
  });

  if (data) {
    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data,
      msg: '已选择负责的财务人员'
    });
  } else {
    ctx.body = new Res({
      status: RESPONSE_CODE.error
    });
  }
});

/**
 * 更新技术负责人
 */
router.post('/arrangeTechLeaderManager', async (ctx, next) => {
  const { registrationUuid, technicalManagerUuid } = ctx.state.param;

  const data = await service.arrangeTechLeaderManager({
    registrationUuid,
    technicalManagerUuid
  });

  if (data) {
    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data,
      msg: '已选择技术负责人'
    });
  } else {
    ctx.body = new Res({
      status: RESPONSE_CODE.error
    });
  }
});

/**
 * 设置第二步合同签署成功状态
 */
router.put('/setContractManagerSuccessStatus', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const res = await service.setContractManagerSuccessStatus(registrationUuid);

  if (res) {
    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data: res
    });
  } else {
    ctx.body = new Res({
      status: RESPONSE_CODE.error,
      msg: '查询失败'
    });
  }
});

/**
 * 设置第二步合同签署失败状态
 */
router.post('/setContractManagerFailStatus', async (ctx, next) => {
  const { registrationUuid, managerFailText } = ctx.state.param;

  const res = await service.setContractManagerFailStatus({
    registrationUuid,
    managerFailText
  });

  if (res) {
    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data: res
    });
  } else {
    ctx.body = new Res({
      status: RESPONSE_CODE.error,
      msg: '查询失败'
    });
  }
});

/**
 * 查询财务管理员
 */
router.get('/queryFinanceManager', async (ctx, next) => {
  const { page } = ctx.state.param;

  const data = await service.queryFinanceManager(page);

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
 * 查询技术负责人
 */
router.get('/queryTechnicalManager', async (ctx, next) => {
  const { page } = ctx.state.param;

  const data = await service.queryTechnicalManager(page);

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

export default router;
