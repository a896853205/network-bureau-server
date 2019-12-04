import enterpriseUserDao from '../dao/enterprise-user-dao';

export default {
  /**
   * 通过用户名查询企业账号
   */
  selectEnterpriseUserByCode: async code => {
    return await enterpriseUserDao.selectEnterpriseUserByCode(code);
  }
};
