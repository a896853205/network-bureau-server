import enterpriseRegistionDao from '../dao/enterprise-registion-dao.js';

import webToken from '../util/token';

export default {
  /**
   * 根据名字查询
   */
  selectEnterpriseRegistionByName: async name => {
    return await enterpriseRegistionDao.selectEnterpriseRegistionByName(name);
  },

  /**
   * 创建登记测试
   */
  createEnterpriseRegistion: async (name, enterpriseUuid) => {
    if (await enterpriseRegistionDao.selectEnterpriseRegistionByName(name)) {
      return false;
    } else {
      await enterpriseRegistionDao.createEnterpriseRegistion(
        name,
        enterpriseUuid
      );

      return true;
    }
  },

  /**
   * 查询登记测试通过企业的uuid
   */
  queryRegistionByEnterpriseUuid: async (enterpriseUuid, page) => {
    return await enterpriseRegistionDao.queryRegistionByEnterpriseUuid(
      enterpriseUuid,
      page
    );
  },

  /**
   * 查询企业用户登记测试七个状态通过uuid
   */
  selectRegistionByEnterpriseUuid: async (uuid) => {
    return await enterpriseRegistionDao.selectRegistionByEnterpriseUuid(
      uuid
    );
  }
};
