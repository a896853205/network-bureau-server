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
   * 根据账号查找用户
   */
  // getManagerUserByUsername: async username => {
  //   return await managerUserDao.selectManagerUserByUsername(username);
  // },
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

    // 将temp的文件copy到production中
    const tempUrl = headPortraitUrl,
      productionUrl = headPortraitUrl.replace('temp', 'production');

    try {
      await client.copy(productionUrl, tempUrl);
    } catch (error) {
      console.log(error);
      return false;
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
    // 将temp的文件copy到production中
    const tempUrl = headPortraitUrl,
      productionUrl = headPortraitUrl.replace('temp', 'production');

    try {
      // 从temp中copy出来而且删除数据库中的url的文件
      const managerUser = await managerUserDao.selectManagerByManagerUuid(
        managerUuid
      );

      if (managerUser.headPortraitUrl) {
        await client.delete(managerUser.headPortraitUrl);
      }

      await client.copy(productionUrl, tempUrl);
    } catch (error) {
      console.log(error);
      return false;
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
