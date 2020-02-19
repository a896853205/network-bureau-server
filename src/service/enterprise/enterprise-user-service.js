import enterpriseUserDao from '../../dao/enterprise/enterprise-user-dao';

import webToken from '../../util/token';

export default {
  /**
   * 获取企业信息通过UUID
   */
  getEnterpriseByUuid: uuid => {
    try {
      return enterpriseUserDao.selectEnterpriseByUuid(uuid);
    } catch (error) {
      throw new Error('未查询到此企业');
    }
  },
  /**
   * 根据企业的用户名和密码判断之后生成token
   */
  getEnterpriseToken: async (code, password) => {
    try {
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
    } catch (error) {
      throw error;
    }
  },

  /**
   * 企业注册
   */
  createNewEnterprise: async ({ code, name, password, phone }) => {
    try {
      if (await enterpriseUserDao.selectEnterpriseByCode(code)) {
        throw new Error('社会统一信用代码已注册');
      }

      // 需要表单认证
      return enterpriseUserDao.createNewEnterprise({
        name,
        password,
        phone,
        code
      });
    } catch (error) {
      throw error;
    }
  }
};
