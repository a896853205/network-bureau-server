import enterpriseRegistrationDao from '../../dao/enterprise/enterprise-registration-dao';

export default {
  /**
   * 根据名字查询
   */
  selectEnterpriseRegistrationByName: async name => {
    return await enterpriseRegistrationDao.selectEnterpriseRegistrationByName(
      name
    );
  },

  /**
   * 创建登记测试
   */
  createEnterpriseRegistration: async (name, enterpriseUuid) => {
    if (
      await enterpriseRegistrationDao.selectEnterpriseRegistrationByName(name)
    ) {
      return false;
    } else {
      await enterpriseRegistrationDao.createEnterpriseRegistration(
        name,
        enterpriseUuid
      );

      return true;
    }
  },

  /**
   * 查询登记测试通过企业的uuid
   */
  queryRegistrationByEnterpriseUuid: async (enterpriseUuid, page) => {
    return await enterpriseRegistrationDao.queryRegistrationByEnterpriseUuid(
      enterpriseUuid,
      page
    );
  },

  /**
   * 查询企业用户登记测试七个状态通过uuid
   */
  selectRegistrationStatusByEnterpriseUuid: async uuid => {
    return await enterpriseRegistrationDao.selectRegistrationStatusByEnterpriseUuid(
      uuid
    );
  },

  /**
   * 查询企业用户登记测试具体的步骤状态
   */
  queryEnterpriseRegistrationStepByUuid: async enterpriseRegistrationUuid => {
    return await enterpriseRegistrationDao.queryEnterpriseRegistrationStepByUuid(
      enterpriseRegistrationUuid
    );
  },

  /**
   *  无参数查询sys_registration_step表
   */
  querySysRegistrationStep: async () => {
    return await enterpriseRegistrationDao.querySysRegistrationStep();
  }
};
