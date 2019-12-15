import managerUserDao from '../dao/manager-user-dao';

import webToken from '../util/token';
import { db } from '../db/db-connect';

export default {
  /**
   * 根据账号查找用户
   */
  selectManagerUserByUsername: async username => {
    return await managerUserDao.selectManagerUserByUsername(username);
  },

  getManagerToken: async (username, password) => {
    const manager = await managerUserDao.selectManagerUserByUsername(username);

    if (!manager || manager.password !== password) {
      return false;
    }

    delete manager.password;

    return {
      token: webToken.parseToken({
        uuid: manager.uuid,
        role: manager.role
      }),
      manager
    };
  }
};
