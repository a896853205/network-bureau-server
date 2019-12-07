import enterpriseUser from '../db/models/enterprise-user';

export default {
  /**
   * 通过用户名查询企业账号
   */
  selectEnterpriseUserByCode: async code => {
    return await enterpriseUser.findOne({
      where: { code },
      attributes: ['id', 'uuid', 'phone', 'name']
    });
  }
};
