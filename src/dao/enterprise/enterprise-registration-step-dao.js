import enterpriseRegistrationStep from '../../db/models/enterprise-registration-step';
import enterpriseRegistrationBasic from '../../db/models/enterprise-registration-basic';
import enterpriseRegistrationContract from '../../db/models/enterprise-registration-contract';

import { REGISTRATION_PAGE_SIZE } from '../../config/system-config';

export default {
  /**
   * 根据enterpriseRegistrationUuid查询具体步骤状态
   */
  queryEnterpriseRegistrationStepByRegistrationUuid: async registrationUuid => {
    return await enterpriseRegistrationStep.findAll({
      where: { uuid: registrationUuid },
      attributes: ['step', 'status', 'statusText', 'managerUuid'],
      raw: true
    });
  },

  /**
   * 更新登记测试的步骤
   */
  updateRegistrationStep: async ({
    registrationUuid,
    status,
    statusText,
    step
  }) => {
    return await enterpriseRegistrationStep.update(
      {
        status,
        statusText
      },
      {
        where: {
          uuid: registrationUuid,
          step
        }
      }
    );
  },

  /**
   * 更新步骤的管理员
   */
  updateRegistrationStepManagerUuid: async ({
    registrationUuid,
    step,
    managerUuid
  }) => {
    return await enterpriseRegistrationStep.update(
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
  queryRegistrationPayment: async ({ page, managerUuid }) => {
    const result = await enterpriseRegistrationStep.findAndCountAll({
      attributes: ['uuid', 'managerUuid','statusText'],
      limit: REGISTRATION_PAGE_SIZE,
      offset: (page - 1) * REGISTRATION_PAGE_SIZE,
      raw: true,
      where: { managerUuid, step: 3 },
      include: [
        {
          model: enterpriseRegistrationBasic,
          attributes: ['enterpriseName', 'phone'],
          as: 'enterpriseRegistrationBasic'
        },
        {
          model: enterpriseRegistrationContract,
          attributes: ['contractCode'],
          as: 'enterpriseRegistrationContract'
        }
      ]
    });

    return {
      paymentList: result.rows,
      total: result.count,
      pageSize: REGISTRATION_PAGE_SIZE
    };
  }

};
