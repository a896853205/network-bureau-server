import managerUserDao from '../../dao/manager/manager-user-dao';

// 工具类
import CustomError from '../../util/custom-error';
import webToken from '../../util/token';

// oss
import client from '../../util/oss';
import { db } from '../../db/db-connect';

export default {
  /**
   * 根据managerUuid查询用户
   */
  selectManagerByManagerUuid: async managerUuid => {
    try {
      // 数据库中查询出头像的路径之后去oss获取当前url
      let managerUser = {},
        headPreviewUrl = null;

      managerUser = await managerUserDao.selectManagerByManagerUuid(
        managerUuid
      );

      if (!managerUser) {
        throw new CustomError('未查询到此管理员');
      }
      headPreviewUrl = await client.signatureUrl(
        managerUser.headPortraitUrl || ''
      );

      // 将头像具体的url属性放入返回对象中
      managerUser.headPreviewUrl = headPreviewUrl;

      return managerUser;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 管理账号登录
   */
  getManagerToken: async (username, password) => {
    try {
      const manager = await managerUserDao.selectManagerUserByUsername(
        username
      );

      if (!manager || manager.password !== password) {
        throw new CustomError('账号或密码错误');
      }

      return {
        token: webToken.parseToken({
          uuid: manager.uuid,
          auth: 'manager'
        }),
        manager
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * 创建管理账号
   */
  createNewManager: async (
    username,
    phone,
    password,
    name,
    role,
    headPortraitUrl
  ) => {
    try {
      const usernameReg = /^\S{3,12}$/,
        passwordReg = /^\S{6,12}$/,
        phoneReg = /^(\d)(\d|-){4,19}$/;

      if (!usernameReg.test(username)) {
        throw new CustomError('账号长度不符合规则!');
      }

      if (!passwordReg.test(password)) {
        throw new CustomError('密码长度不符合规则!');
      }

      if (!phoneReg.test(phone)) {
        throw new CustomError('电话号码不符合规则!');
      }

      if (!name?.length || name?.length > 32) {
        throw new CustomError('名字长度不符合规则!');
      }

      if (await managerUserDao.selectManagerUserByUsername(username)) {
        throw new CustomError('管理员账号已存在');
      }
      if (headPortraitUrl) {
        let productionUrl = '';
        // 将temp的文件copy到production中
        const [filePosition] = headPortraitUrl.split('/');

        if (filePosition === 'temp') {
          const tempUrl = headPortraitUrl;
          productionUrl = headPortraitUrl.replace('temp', 'production');

          await client.copy(productionUrl, tempUrl);
        } else if (filePosition === 'production') {
          productionUrl = headPortraitUrl;
        } else {
          throw new CustomError('oss文件路径错误');
      }
    }

      await managerUserDao.createNewManagerUser(
        username,
        phone,
        password,
        name,
        role,
        productionUrl
      );
    } catch (error) {
      throw error;
    }
  },

  /**
   * 删除管理员账号
   */
  deleteManager: managerUuid => {
    // #TODO 删除之前判断是否有此管理员是否是项目管理员最后一个
    // #TODO 判断此管理员是否被项目所依赖(登记测试有两个表, enterpriseRegistrationStep和enterpriseRegistration)
    // #TODO 委托测试和委托合同的时候都要有所判断
    // #TODO 头像oss也得删除
    return managerUserDao.deleteManager(managerUuid);
  },

  /**
   * 更改管理员账号
   */
  updateManager: async (
    managerUuid,
    phone,
    password,
    name,
    headPortraitUrl
  ) => {
    try {
      let productionUrl = '';
      if (headPortraitUrl) {
        // 将temp的文件copy到production中
        const [filePosition] = headPortraitUrl.split('/');

        if (filePosition === 'temp') {
          const tempUrl = headPortraitUrl;
          productionUrl = headPortraitUrl.replace('temp', 'production');
          const managerUser = await managerUserDao.selectManagerByManagerUuid(
            managerUuid
          );

          if (managerUser?.headPortraitUrl) {
            await client.delete(managerUser.headPortraitUrl);
          }

          await client.copy(productionUrl, tempUrl);
        } else if (filePosition === 'production') {
          productionUrl = headPortraitUrl;
        } else {
          throw new CustomError('oss文件路径错误');
        }
      } else {
        throw new CustomError('请上传头像!');
      }

      await managerUserDao.updeteManager(
        managerUuid,
        phone,
        password,
        name,
        productionUrl
      );
    } catch (error) {
      throw error;
    }
  },

  /**
   * 查询管理员账号
   */
  queryManager: page => {
    try {
      return managerUserDao.queryManagerUser(page);
    } catch (error) {
      throw error;
    }
  },

  /**
   * 查询财务管理员账号
   */
  queryFinanceManager: page => managerUserDao.queryFinanceManagerUser(page)
};
