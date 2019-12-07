import enterpriseUserDao from '../dao/enterprise-user-dao';

export default {
  /**
   * 根据企业的用户名和密码判断之后生成token
   */
  getEnterpriseToken: async (code, password) => {
    const enterprise = await enterpriseUserDao.selectEnterpriseUserByCode(code);
  
    if (!enterprise || enterprise.password !== password) {
      return;
    }

    return {
      token: webToken.parseToken({
        uuid: enterprise.uuid
      }),
      enterprise
    }
  }
};
