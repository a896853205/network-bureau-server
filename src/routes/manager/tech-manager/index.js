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
    console.error(error);
    ctx.throw(RESPONSE_CODE.error, '查询失败');
  }
});

/**
 * 技术人员查询样品文档集的基本信息
 */
router.get('/getRegistrationTestSpecimen', async (ctx, next) => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.getRegistrationTestSpecimen(registrationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    console.error(error);
    ctx.throw(RESPONSE_CODE.error, '查询失败');
  }
});

/**
 * 技术人员查询现场测试申请表的基本信息
 */
router.get('/getRegistrationTestApply', async (ctx, next) => {
  try {
    const { registrationUuid } = ctx.state.param;

    const data = await service.getRegistrationTestApply(registrationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data
    });
  } catch (error) {
    console.error(error);
    ctx.throw(RESPONSE_CODE.error, '查询失败');
  }
});

/**
 * 设置现场申请表审核通过状态
 */
router.post('/setApplyManagerStatus', async (ctx, next) => {
  try {
    const { registrationUuid } = ctx.state.param;

    const res = await service.setApplyManagerStatus(registrationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data: res
    });
  } catch (error) {
    console.error(error);
    ctx.throw(RESPONSE_CODE.error, '设置状态失败');
  }
});

/**
 * 设置现场申请表审核不通过状态
 */
router.post('/setApplyManagerFailStatus', async (ctx, next) => {
  try {
    const { registrationUuid, failManagerText } = ctx.state.param;

    const res = await service.setApplyManagerFailStatus({
      registrationUuid,
      failManagerText
    });

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data: res
    });
  } catch (error) {
    console.error(error);
    ctx.throw(RESPONSE_CODE.error, '设置状态失败');
  }
});

/**
 * 设置样品登记表审核通过状态
 */
router.post('/setSpecimenManagerStatus', async (ctx, next) => {
  try {
    const { registrationUuid } = ctx.state.param;

    const res = await service.setSpecimenManagerStatus(registrationUuid);

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data: res
    });
  } catch (error) {
    console.error(error);
    ctx.throw(RESPONSE_CODE.error, '设置状态失败');
  }
});

/**
 * 设置样品登记表审核不通过状态
 */
router.post('/setSpecimenManagerFailStatus', async (ctx, next) => {
  try {
    const { registrationUuid, failManagerText } = ctx.state.param;

    const res = await service.setSpecimenManagerFailStatus({
      registrationUuid,
      failManagerText
    });

    ctx.body = new Res({
      status: RESPONSE_CODE.success,
      data: res
    });
  } catch (error) {
    console.error(error);
    ctx.throw(RESPONSE_CODE.error, '设置状态失败');
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
    console.error(error);
    ctx.throw(RESPONSE_CODE.error, '查询失败');
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
    console.error(error);
    ctx.throw(RESPONSE_CODE.error, '查询失败');
  }
});

export default router;
