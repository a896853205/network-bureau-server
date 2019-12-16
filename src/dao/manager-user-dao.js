import managerUser from '../db/models/manager-user';

import uuid from 'uuid';

export default {
  /**
   * 通过用户名查询管理员
   */
  selectManagerUserByUsername: async username => {
    return await managerUser.findOne({
      where: { username },
      attributes: ['uuid', 'phone', 'username', 'password', 'name', 'role']
    });
  },

  /**
   * 创建管理员
   */
  createNewManagerUser: async (username, phone, password, name, role) => {
    return await managerUser.create({
      username,
      password,
      phone,
      name,
      role,
      uuid: uuid.v1()
    });
  },

  /**
   * 删除企业用户
   */
  deleteManager: async uuid => {
    return await managerUser.destroy({
      where: { uuid }
    });
  },

  /**
   * 更改企业用户
   */
  updeteManager: async ( uuid, phone, password, name ) => {
    return await managerUser.update(
      { phone, password, name },
      {
        where: { uuid }
      }
    );
  }
};
