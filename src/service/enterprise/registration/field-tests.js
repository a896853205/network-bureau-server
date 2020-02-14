import { db } from '../../../db/db-connect';

// dao
import managerUserDao from '../../../dao/manager/manager-user-dao';
import enterpriseRegistrationStepDao from '../../../dao/enterprise/enterprise-registration-step-dao';

export default {

/**
   * 查询技术负责人
   */
  queryTechnicalManager: async page => {
    return await managerUserDao.queryTechnicalManagerUser(page);
  },

  /**
   * 安排技术负责人
   */
  arrangeTechnicalManager: async ({ registrationUuid, technicalManagerUuid }) => {
    return db.transaction(() => {
      return Promise.all([
        enterpriseRegistrationStepDao.updateRegistrationStep({
          registrationUuid,
          status: 2,
          statusText: '已选择技术负责人',
          step: 4
        }),
        enterpriseRegistrationStepDao.updateRegistrationStepManagerUuid({
          registrationUuid,
          step: 4,
          managerUuid: technicalManagerUuid
        })
      ]);
    });
  },

};
