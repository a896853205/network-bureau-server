import enterpriseRegistrationStep from '../../db/models/enterprise-registration-step';

export default {
  bulkInsertRegistrationStep: ({
    enterpriseRegistrationSteps,
    transaction = null
  }) => {
    return enterpriseRegistrationStep.bulkCreate(enterpriseRegistrationSteps, {
      transaction
    });
  },

  /**
   * 根据enterpriseRegistrationUuid查询具体步骤状态
   */
  queryEnterpriseRegistrationStepByRegistrationUuid: registrationUuid => {
    return enterpriseRegistrationStep.findAll({
      where: { uuid: registrationUuid },
      attributes: ['step', 'status', 'statusText', 'managerUuid'],
      raw: true,
      order: ['step']
    });
  },

  /**
   * 更新登记测试的步骤
   */
  updateRegistrationStep: ({
    registrationUuid,
    status,
    statusText,
    step,
    transaction = null
  }) => {
    return enterpriseRegistrationStep.update(
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
    );
  },

  /**
   * 更新步骤的管理员
   */
  updateRegistrationStepManagerUuid: ({
    registrationUuid,
    step,
    managerUuid
  }) => {
    return enterpriseRegistrationStep.update(
      { managerUuid },
      {
        where: {
          uuid: registrationUuid,
          step
        }
      }
    );
  },

  /**
   * 查询企业的缴费信息
   */
  queryRegistrationByManagerUuid: managerUuid => {
    return enterpriseRegistrationStep.findAll({
      attributes: ['uuid'],
      raw: true,
      where: { managerUuid }
    });
  }
};
