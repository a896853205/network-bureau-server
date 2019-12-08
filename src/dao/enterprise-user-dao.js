import enterpriseUser from '../db/models/enterprise-user';

import uuid from 'uuid';

export default {
  /**
   * 通过用户名查询企业账号
   */
  selectEnterpriseUserByCode: async code => {
    return await enterpriseUser.findOne({
      where: { code },
      attributes: ['id', 'uuid', 'phone', 'name', 'password']
    });
  },

  /**
   * 根据用户名查找是否有相同企业
   */
  selectEnterpriseByName: async name => {
    return await enterpriseUser.findOne({
      where: { name }
    });
  },

  /**
   * 创建企业用户
   */
  createNewEnterprise: async ({ name, password, phone, code }) => {
    return await enterpriseUser.create({
      name,
      password,
      phone,
      code,
      uuid: uuid.v1()
    });
  }
};
