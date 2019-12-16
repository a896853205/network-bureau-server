import managerUserDao from '../dao/manager-user-dao';

import webToken from '../util/token';
import { db } from '../db/db-connect';

export default {
  /**
   * 根据账号查找用户
   */
  // selectManagerUserByUsername: async username => {
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
        uuid: manager.uuid
      }),
      manager
    };
  },

  /**
   * 创建管理账号
   */
  createNewManager: async (username, phone, password, name, role) => {
    if (await managerUserDao.selectManagerUserByUsername(username)) {
      return false;
    }

    await managerUserDao.createNewManagerUser(
      username,
      phone,
      password,
      name,
      role
    );

    return true;
  },

  /**
   * 查询企业数据
   */
  createNewManager: async (username, phone, password, name, role) => {
    if (await managerUserDao.selectManagerUserByUsername(username)) {
      return false;
    }

    await managerUserDao.createNewManagerUser(
      username,
      phone,
      password,
      name,
      role
    );

    return true;
  },

  /**
  * 查询企业用户
  */
  queryEnterprise: async () => {
    if (await managerUserDao.queryEnterpriseUser())
      return true;
    else
      return false;
  },

};
