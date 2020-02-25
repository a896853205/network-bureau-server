import enterpriseUserDao from '../../dao/enterprise/enterprise-user-dao';

// 工具
import webToken from '../../util/token';
import CustomError from '../../util/custom-error';
import CheckSocialCreditCode from '../../util/code';

export default {
  /**
   * 获取企业信息通过UUID
   */
  getEnterpriseByUuid: uuid => enterpriseUserDao.selectEnterpriseByUuid(uuid),
  /**
   * 根据企业的用户名和密码判断之后生成token
   */
  getEnterpriseToken: async (code, password) => {
    try {
      let enterprise = await enterpriseUserDao.selectEnterpriseUserByCode(code);

      if (!enterprise || enterprise.password !== password) {
        throw new CustomError('用户名或密码错误');
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
      return db.transaction(async transaction => {
        if (
          await enterpriseUserDao.selectEnterpriseByCode({ code, transaction })
        ) {
          throw new CustomError('社会统一信用代码已注册');
        }
        const phoneReg = /^(\d)(\d|-){4,19}$/;

        if (!name.length || name.length > 32) {
          throw new CustomError('用户名长度不符合规则!');
        }

        if (password.length < 6 || password.length > 32) {
          throw new CustomError('密码长度不符合规则!');
        }

        if (!phoneReg.test(phone)) {
          throw new CustomError('电话号码不符合规则!');
        }

        if (!CheckSocialCreditCode(code)) {
          throw new CustomError('统一社会信用代码不符合规则!');
        }

        // 需要表单认证
        return await enterpriseUserDao.createNewEnterprise({
          name,
          password,
          phone,
          code,
          transaction
        });
      });
    } catch (error) {
      throw error;
    }
  }
};
