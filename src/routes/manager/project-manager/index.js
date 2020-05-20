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
 * 查询企业的登记测试列表
 */
router.get('/queryRegistration', async (ctx, next) => {
  try {
    const { page } = ctx.state.param;

    const data = await service.queryRegistration(page);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 通过uuid查询企业基本信息
 */
router.get('/selectEnterpriseInfo', async (ctx, next) => {
  try {
    const { uuid } = ctx.state.param;

    const data = await service.getEnterpriseByUuid(uuid);

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
router.get('/selectRegistration', async (ctx, next) => {
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
router.get('/queryEnterpriseRegistrationStep', async (ctx, next) => {
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
 * 查询企业用户登记测试8个文件
 */
router.get('/selectRegistrationStatus', async (ctx, next) => {
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
 * 查询登记测试的基本信息
 */
router.get('/selectRegistrationBasic', async (ctx, next) => {
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
 * 查询评测合同的基本信息
 */
router.get('/selectRegistrationContract', async (ctx, next) => {
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
 * 查询样品文档集的基本信息
 */
router.get('/selectRegistrationSpecimen', async (ctx, next) => {
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
 * 查询现场测试申请表的基本信息
 */
router.get('/selectRegistrationApply', async (ctx, next) => {
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
 * 设置审核通过状态
 */
router.post('/setRegistrationDetailSuccessStatus', async (ctx, next) => {
  try {
    const { registrationUuid, type } = ctx.state.param;

    await service.setRegistrationDetailStatus({
      registrationUuid,
      type,
      isPass: true
    });

    ctx.body = new Res({
      status: RESPONSE_CODE.success
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 设置内容错误状态
 */
router.post('/setRegistrationDetailFailStatus', async (ctx, next) => {
  try {
    const { registrationUuid, type, failText } = ctx.state.param;

    await service.setRegistrationDetailStatus({
      registrationUuid,
      type,
      failText,
      isPass: false
    });

    ctx.body = new Res({
      status: RESPONSE_CODE.success
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 获取产品说明的信息
 */
router.get('/selectRegistrationProductDescription', async (ctx, next) => {
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
 * 获取样品的信息
 */
router.get('/selectRegistrationProduct', async (ctx, next) => {
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
 * 获取用户文档集的信息
 */
router.get('/selectRegistrationDocument', async (ctx, next) => {
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
 * 获取软件著作权证书的信息
 */
router.get('/selectRegistrationCopyright', async (ctx, next) => {
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
 * 查询经管部门填写评测合同的基本信息
 */
router.get('/selectRegistrationContractManager', async (ctx, next) => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.selectRegistrationContractManager(
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
 * 查询评测合同的路由
 */
router.get('/selectContractUrl', async (ctx, next) => {
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
 * 保存经管部门填写评测合同的基本信息
 */
router.post('/saveRegistrationContractManager', async (ctx, next) => {
  try {
    const {
      registrationUuid,
      contractCode,
      specimenHaveTime,
      payment,
      paymentTime,
      contractTime
    } = ctx.state.param;

    await service.saveRegistrationContractManager({
      registrationUuid,
      contractCode,
      specimenHaveTime,
      payment,
      paymentTime,
      contractTime
    });

    ctx.body = new Res({
      status: RESPONSE_CODE.success
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 管理员下载合同word
 */
router.get('/downloadContractWord', async ctx => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.generateContractWord(registrationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 保存评测合同甲方上传pdf合同的信息
 */
router.post('/saveManagerContractUrl', async (ctx, next) => {
  try {
    const { registrationUuid, managerUrl } = ctx.state.param;

    await service.saveManagerContractUrl({
      registrationUuid,
      managerUrl
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
router.post('/updateFinanceManager', async (ctx, next) => {
  try {
    const { registrationUuid, financeManagerUuid } = ctx.state.param;

    await service.updateFinanceManager({
      registrationUuid,
      financeManagerUuid
    });

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      msg: '已选择负责的财务人员'
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 更新技术负责人
 */
router.post('/arrangeTechLeaderManager', async (ctx, next) => {
  try {
    const { registrationUuid, technicalManagerUuid } = ctx.state.param;

    await service.arrangeTechLeaderManager({
      registrationUuid,
      technicalManagerUuid
    });

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      msg: '已选择技术负责人'
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 设置第二步合同签署成功状态
 */
router.put('/setContractManagerSuccessStatus', async (ctx, next) => {
  try {
    const { registrationUuid } = ctx.state.param;

    await service.setContractManagerSuccessStatus(registrationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 设置第二步合同签署失败状态
 */
router.post('/setContractManagerFailStatus', async ctx => {
  try {
    const { registrationUuid, managerFailText } = ctx.state.param;

    await service.setContractManagerFailStatus({
      registrationUuid,
      managerFailText
    });

    ctx.body = new Res({
      status: RESPONSE_CODE.success
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 查询财务管理员
 */
router.get('/queryFinanceManager', async (ctx, next) => {
  try {
    const { page } = ctx.state.param;
    const data = await service.queryFinanceManager(page);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 查询技术负责人
 */
router.get('/queryTechnicalManager', async (ctx, next) => {
  try {
    const { page } = ctx.state.param;
    const data = await service.queryTechnicalManager(page);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    throw error;
  }
});
/**
 * 查询登记测试财务管理员的uuid
 */
router.get('/selectRegistrationAccoutantManagerUuid', async (ctx, next) => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.selectRegistrationAccoutantManagerUuid(
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
 * 查询登记测试技术负责人的uuid
 */
router.get('/selectRegistrationTechLeaderManagerUuid', async (ctx, next) => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.selectRegistrationTechLeaderManagerUuid(
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
 * 项目管理员查询现场测试申请表的基本信息
 */
router.get('/getProjectRegistrationTestApply', async (ctx, next) => {
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
 * 项目管理员查询样品文档集的基本信息
 */
router.get('/getProjectRegistrationTestSpecimen', async (ctx, next) => {
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
 * 项目管理员设置样品登记表审核通过状态
 */
router.post('/setProjectSpecimenManagerStatus', async (ctx, next) => {
  try {
    const projectManagerUuid = ctx.state.user.uuid;
    const { registrationUuid } = ctx.state.param;

    const res = await service.setProjectSpecimenManagerStatus({
      projectManagerUuid,
      registrationUuid
    });

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data: res
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 项目管理员设置样品登记表审核不通过状态
 */
router.post('/setProjectSpecimenManagerFailStatus', async (ctx, next) => {
  try {
    const { registrationUuid, failManagerText } = ctx.state.param;

    const res = await service.setProjectSpecimenManagerFailStatus({
      registrationUuid,
      failManagerText
    });

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data: res
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 查找原始记录url
 */
router.get('/selectProjectManagerRegistrationRecord', async (ctx, next) => {
  try {
    const { registrationUuid } = ctx.state.param;
    const data = await service.selectProjectManagerRegistrationRecord(
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
 * 保存原始记录url
 */
router.post('/saveRecordFinaltUrl', async (ctx, next) => {
  try {
    const { registrationUuid, finalUrl } = ctx.state.param;
    const projectManagerUuid = ctx.state.user.uuid;

    await service.saveRecordFinaltUrl({
      registrationUuid,
      finalUrl,
      projectManagerUuid
    });

    ctx.body = new Res({
      status: RESPONSE_CODE.success
    });
  } catch (error) {
    throw error;
  }
});

/**
 * 查找现场报告url
 */
router.get('/selectProjectManagerRegistrationReport', async (ctx, next) => {
  try {
    const { registrationUuid } = ctx.state.param;
    const data = await service.selectProjectManagerRegistrationReport(
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
 * 保存查找现场报告urlurl
 */
router.post('/saveReportFinaltUrl', async (ctx, next) => {
  try {
    const { registrationUuid, finalUrl } = ctx.state.param;
    const projectManagerUuid = ctx.state.user.uuid;

    await service.saveReportFinaltUrl({
      registrationUuid,
      finalUrl,
      projectManagerUuid
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
router.get('/getProjectRegistrationTestReport', async ctx => {
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
router.get('/getProjectRegistrationTestRecord', async ctx => {
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

export default router;
