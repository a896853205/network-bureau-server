import managerUserDao from '../../dao/manager/manager-user-dao';

import webToken from '../../util/token';

// oss
import client from '../../util/oss';

export default {
  /**
   * 根据managerUuid查询用户
   */
  getManagerByManagerUuid: async managerUuid => {
    // 数据库中查询出头像的路径之后去oss获取当前url
    let managerUser = {},
      headPreviewUrl = null;

    try {
      managerUser = await managerUserDao.selectManagerByManagerUuid(
        managerUuid
      );
      headPreviewUrl = await client.signatureUrl(managerUser.headPortraitUrl);
    } catch (error) {
      headPreviewUrl = '';
    }

    // 将头像具体的url属性放入返回对象中
    managerUser.headPreviewUrl = headPreviewUrl;

    return managerUser;
  },
  
  /**
   * 管理账号登录
   */
  getManagerToken: async (username, password) => {
    const manager = await managerUserDao.selectManagerUserByUsername(username);

    if (!manager || manager.password !== password) {
      return false;
    }

    return {
      token: webToken.parseToken({
        uuid: manager.uuid,
        auth: 'manager'
      }),
      manager
    };
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
    if (await managerUserDao.selectManagerUserByUsername(username)) {
      return false;
    }

    try {
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
        throw Error('oss文件路径错误');
      }

      await managerUserDao.createNewManagerUser(
        username,
        phone,
        password,
        name,
        role,
        productionUrl
      );

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  /**
   * 删除管理员账号
   */
  deleteManager: async managerUuid => {
    if (await managerUserDao.deleteManager(managerUuid)) {
      return true;
    }
    return false;
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
        throw Error('oss文件路径错误');
      }

      if (
        await managerUserDao.updeteManager(
          managerUuid,
          phone,
          password,
          name,
          productionUrl
        )
      ) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  /**
   * 查询管理员账号
   */
  queryManager: async page => {
    return await managerUserDao.queryManagerUser(page);
  },

  /**
   * 查询财务管理员账号
   */
  queryFinanceManager: async page => {
    return await managerUserDao.queryFinanceManagerUser(page);
  }
};
