import { db } from '../../../db/db-connect';

// dao
import managerUserDao from '../../../dao/manager/manager-user-dao';
import enterpriseRegistrationDao from '../../../dao/enterprise/enterprise-registration-dao';
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
  arrangeTechLeaderManager: async ({
    registrationUuid,
    technicalManagerUuid
  }) => {
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

  /**
   * 查询待分配技术负责人员的企业登记测试列表
   */
  queryRegistrationNeedAssigned: async ({ page, managerUuid }) => {
    const registrationList = await enterpriseRegistrationStepDao.queryRegistrationByManagerUuid(
      managerUuid
    );
    console.log('registrationList=', registrationList);

    const uuidList = registrationList.map(item => item.uuid);

    return await enterpriseRegistrationDao.queryRegistrationNeedAssigned({
      page,
      uuidList
    });
  }
};
