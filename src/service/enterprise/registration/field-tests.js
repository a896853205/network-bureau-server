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
    return await db.transaction(transaction => {
      return Promise.all([
        enterpriseRegistrationStepDao.updateRegistrationStep({
          registrationUuid,
          status: 2,
          statusText: '已选择技术负责人',
          step: 4,
          transaction
        }),
        enterpriseRegistrationStepDao.updateRegistrationStepManagerUuid({
          registrationUuid,
          step: 4,
          managerUuid: technicalManagerUuid,
          transaction
        }),
        enterpriseRegistrationDao.updateRegistrationTechLeaderUuid({
          registrationUuid,
          techLeaderManagerUuid: technicalManagerUuid,
          transaction
        })
      ]);
    });
  },
  /**
   * 查询待分配技术负责人员的企业登记测试列表
   */
  queryRegistrationNeedAssigned: async ({ page, managerUuid }) => {
    const registrationList = await enterpriseRegistrationStepDao.queryRegistrationNeedAssignedByManagerUuid(
      managerUuid
    );

    const uuidList = registrationList.map(item => item.uuid);
    return await enterpriseRegistrationDao.queryRegistrationNeedAssigned({
      page,
      uuidList
    });
  },

  /**
   * 查询技术人员
   */
  queryTechManager: async page => {
    return await managerUserDao.queryTechManagerUser(page);
  },

  /**
   * 安排技术人员
   */
  arrangeTechManager: async ({ registrationUuid, techManagerUuid }) => {
    try {
      await db.transaction(transaction => {
        return Promise.all([
          enterpriseRegistrationStepDao.updateRegistrationStep({
            registrationUuid,
            status: 3,
            statusText: '已选择技术人员',
            step: 4,
            transaction
          }),
          enterpriseRegistrationDao.updateRegistrationTechManagerUuid({
            registrationUuid,
            techManagerUuid,
            transaction
          })
        ]);
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
};
