import Router from 'koa-router';
import Res from '../../../util/response';
import { RESPONSE_CODE } from '../../../constants/domain-constants';

import enterpriseRegistrationService from '../../../service/enterprise/enterprise-registration-service';
import enterpriseUserService from '../../../service/enterprise/enterprise-user-service';

// 权限
import verifyAuth from '../../../middle/verify-auth';
import { AUTHORITY } from '../../../constants/role-constants';

const PREFIX = '/projectManager',
  router = new Router({
    prefix: PREFIX
  });

router.use(PREFIX, verifyAuth(AUTHORITY.PROJECT_MANAGER.name));

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
 * 查询企业的登记测试列表
 */
router.get('/queryRegistration', async (ctx, next) => {
  const { page } = ctx.state.param;

  const data = await enterpriseRegistrationService.queryRegistration(page);

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

  const data = await enterpriseUserService.getEnterpriseByUuid(uuid);

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
 * 查询企业用户登记测试8个文件
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
 * 查询样品文档集的基本信息
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

router.post('/setRegistrationDetailStatus', async (ctx, next) => {
  const { registrationUuid, type, status, failText } = ctx.state.param;

  const res = await enterpriseRegistrationService.setRegistrationDetailStatus({
    registrationUuid,
    type,
    status,
    failText
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

  const data = await enterpriseRegistrationService.getRegistrationProductDescription(
    {
      registrationUuid
    }
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
 * 获取产品介质的信息
 */
router.get('/selectRegistrationProduct', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await enterpriseRegistrationService.getRegistrationProduct(
    {
      registrationUuid
    }
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
 * 获取用户文档集的信息
 */
router.get('/selectRegistrationDocument', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await enterpriseRegistrationService.getRegistrationDocument(
    {
      registrationUuid
    }
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
 * 获取软件著作权证书的信息
 */
router.get('/selectRegistrationCopyright', async (ctx, next) => {
  const { registrationUuid } = ctx.state.param;

  const data = await enterpriseRegistrationService.getRegistrationCopyright(
    {
      registrationUuid
    }
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
