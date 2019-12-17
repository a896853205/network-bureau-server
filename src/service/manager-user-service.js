import managerUserDao from '../dao/manager-user-dao';

import webToken from '../util/token';
import { db } from '../db/db-connect';

export default {
  /**
   * 根据uuid查询用户
   */
  getManagerByUuid: async uuid => {
    return await managerUserDao.selectManagerByUuid(uuid);
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
   * 删除企业
   */
  deleteManager: async uuid =>{
    if(await managerUserDao.deleteManager(uuid)) {
      return true;
    }
    return false;
  },

  /**
   * 更改企业
   */
  updateManager: async (uuid, phone, password, name ) => {
    if(await managerUserDao.updeteManager( uuid, phone, password, name )) {
     
      return true;
    }
    return false;
  }
};
