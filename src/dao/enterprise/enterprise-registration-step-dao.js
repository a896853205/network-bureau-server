import enterpriseRegistrationStep from '../../db/models/enterprise-registration-step';

export default {
  bulkInsertRegistrationStep: ({
    enterpriseRegistrationSteps,
    transaction = null
  }) =>
    enterpriseRegistrationStep.bulkCreate(enterpriseRegistrationSteps, {
      transaction
    }),

  /**
   * 根据enterpriseRegistrationUuid查询具体步骤状态
   */
  queryEnterpriseRegistrationStepByRegistrationUuid: registrationUuid =>
    enterpriseRegistrationStep.findAll({
      where: { uuid: registrationUuid },
      attributes: ['step', 'status', 'statusText', 'managerUuid'],
      raw: true,
      order: ['step']
    }),

  /**
   * 更新登记测试的步骤
   */
  updateRegistrationStep: ({
    registrationUuid,
    status,
    statusText,
    step,
    transaction = null
  }) =>
    enterpriseRegistrationStep.update(
      {
        status,
        statusText
      },
      {
        where: {
          uuid: registrationUuid,
          step
        },
        transaction
      }
    ),

  /**
   * 更新步骤的管理员
   */
  updateRegistrationStepManagerUuid: ({
    registrationUuid,
    step,
    managerUuid,
    transaction = null
  }) =>
    enterpriseRegistrationStep.update(
      { managerUuid },
      {
        where: {
          uuid: registrationUuid,
          step
        },
        transaction
      }
    ),

  /**
   * 查询企业的缴费信息
   */
  queryRegistrationByManagerUuid: managerUuid =>
    enterpriseRegistrationStep.findAll({
      attributes: ['uuid'],
      raw: true,
      where: { managerUuid }
    }),

  /**
   * 查询企业的第四步信息
   */
  queryRegistrationNeedAssignedByManagerUuid: managerUuid =>
    enterpriseRegistrationStep.findAll({
      attributes: ['uuid'],
      raw: true,
      where: { managerUuid }
    })
};
