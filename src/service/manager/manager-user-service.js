import managerUserDao from '../../dao/manager/manager-user-dao';

import webToken from '../../util/token';

// oss
import client from '../../util/oss';

export default {
  /**
   * 根据uuid查询用户
   */
  getManagerByUuid: async uuid => {
    // 数据库中查询出头像的路径之后去oss获取当前url
    let managerUser = {},
      headPreviewUrl = null;

    try {
      managerUser = await managerUserDao.selectManagerByUuid(uuid);
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

    await managerUserDao.createNewManagerUser(
      username,
      phone,
      password,
      name,
      role,
      headPortraitUrl
    );

    return true;
  },

  /**
   * 删除管理员账号
   */
  deleteManager: async uuid => {
    if (await managerUserDao.deleteManager(uuid)) {
      return true;
    }
    return false;
  },

  /**
   * 更改管理员账号
   */
  updateManager: async (uuid, phone, password, name, headPortraitUrl) => {
    if (
      await managerUserDao.updeteManager(
        uuid,
        phone,
        password,
        name,
        headPortraitUrl
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
  }
};
