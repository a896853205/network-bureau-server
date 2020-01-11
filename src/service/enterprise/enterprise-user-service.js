import enterpriseUserDao from '../../dao/enterprise/enterprise-user-dao';

import webToken from '../../util/token';

export default {
  /**
   * 获取企业信息通过UUID
   */
  getEnterpriseByUuid: async uuid => {
    return await enterpriseUserDao.selectEnterpriseByUuid(uuid);
  },
  /**
   * 根据企业的用户名和密码判断之后生成token
   */
  getEnterpriseToken: async (code, password) => {
    let enterprise = await enterpriseUserDao.selectEnterpriseUserByCode(code);

    if (!enterprise || enterprise.password !== password) {
      return false;
    }

    delete enterprise.password;

    return {
      token: webToken.parseToken({
        uuid: enterprise.uuid,
        auth: 'enterprise'
      }),
      enterprise
    };
  },

  /**
   * 企业注册
   */
  createNewEnterprise: async ({ code, name, password, phone }) => {
    if (await enterpriseUserDao.selectEnterpriseByCode(code)) {
      return false;
    }

    // 需要表单认证
    await enterpriseUserDao.createNewEnterprise({
      name,
      password,
      phone,
      code
    });

    return true;
  }
};