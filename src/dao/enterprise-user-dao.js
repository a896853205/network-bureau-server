import enterpriseUser from '../db/models/enterprise-user';

import uuid from 'uuid';

export default {
  /**
   * 通过uuid查询企业账号
   */
  selectEnterpriseByUuid: async uuid => {
    return await enterpriseUser.findOne({
      where: { uuid },
      attributes: ['uuid', 'phone', 'name', 'password'],
      raw: true
    });
  },
  /**
   * 通过用户名查询企业账号
   */
  selectEnterpriseUserByCode: async code => {
    return await enterpriseUser.findOne({
      where: { code },
      attributes: ['uuid', 'phone', 'name', 'password'],
      raw: true
    });
  },

  /**
   * 根据用户名查找是否有相同企业
   */
  selectEnterpriseByCode: async code => {
    return await enterpriseUser.findOne({
      where: { code },
      raw: true
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
