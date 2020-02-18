import enterpriseUser from '../../db/models/enterprise-user';

import uuid from 'uuid';

export default {
  /**
   * 通过uuid查询企业账号
   */
  selectEnterpriseByUuid: uuid =>
    enterpriseUser.findOne({
      where: { uuid },
      attributes: ['code', 'uuid', 'phone', 'name', 'password'],
      raw: true
    }),
  /**
   * 通过用户名查询企业账号
   */
  selectEnterpriseUserByCode: code =>
    enterpriseUser.findOne({
      where: { code },
      attributes: ['uuid', 'phone', 'name', 'password'],
      raw: true
    }),

  /**
   * 根据用户名查找是否有相同企业
   */
  selectEnterpriseByCode: code =>
    enterpriseUser.findOne({
      where: { code },
      raw: true
    }),

  /**
   * 创建企业用户
   */
  createNewEnterprise: ({ name, password, phone, code }) =>
    enterpriseUser.create({
      name,
      password,
      phone,
      code,
      uuid: uuid.v1()
    })
};
