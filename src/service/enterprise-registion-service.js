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
   * 查询管理员账号
   */
  queryRegistionByUuid: async (enterpriseUuid, page) => {
    console.log(enterpriseUuid);
    return await enterpriseRegistionDao.queryRegistionItems(
      enterpriseUuid,
      page
    );
  }
};
