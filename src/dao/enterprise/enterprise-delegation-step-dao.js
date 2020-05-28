import enterpriseDelegationStep from '../../db/models/enterprise-delegation-step';
import Sequelize from 'sequelize';
const { ne } = Sequelize.Op;

export default {
  bulkInsertDelegationStep: ({
    enterpriseDelegationSteps,
    transaction = null
  }) =>
    enterpriseDelegationStep.bulkCreate(enterpriseDelegationSteps, {
      transaction
    }),

  /**
   * 根据enterpriseDelegationUuid查询具体步骤状态
   */
  queryEnterpriseDelegationStepByDelegationUuid: ({
    delegationUuid,
    transaction
  }) =>
    enterpriseDelegationStep.findAll({
      where: { uuid: delegationUuid },
      attributes: ['step', 'status', 'statusText', 'managerUuid'],
      raw: true,
      order: ['step'],
      transaction
    }),

  /**
   * 更新登记测试的步骤
   */
  updateDelegationStep: ({
    delegationUuid,
    status,
    statusText,
    step,
    transaction = null
  }) =>
    enterpriseDelegationStep.update(
      {
        status,
        statusText
      },
      {
        where: {
          uuid: delegationUuid,
          step
        },
        transaction
      }
    ),

  /**
   * 更新步骤的管理员
   */
  updateDelegationStepManagerUuid: ({
    delegationUuid,
    step,
    managerUuid,
    transaction = null
  }) =>
    enterpriseDelegationStep.update(
      { managerUuid },
      {
        where: {
          uuid: delegationUuid,
          step
        },
        transaction
      }
    ),

  /**
   * 查询企业的缴费信息
   */
  queryDelegationByManagerUuid: managerUuid =>
    enterpriseDelegationStep.findAll({
      attributes: ['uuid'],
      raw: true,
      where: { managerUuid }
    }),

  /**
   * 查询企业的第四步信息
   */
  queryDelegationNeedAssignedByManagerUuid: managerUuid =>
    enterpriseDelegationStep.findAll({
      attributes: ['uuid'],
      raw: true,
      where: { managerUuid }
    }),

  /**
   * 批准人查找注册登记信息
   */
  quaryCertifyDelegation: () =>
    enterpriseDelegationStep.findAll({
      where: {
        step: 4,
        status: { [ne]: 0 }
      },
      attributes: ['uuid'],
      raw: true,
      order: ['status']
    })
};
