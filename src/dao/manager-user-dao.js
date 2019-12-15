import managerUser from '../db/models/manager-user';

import uuid from 'uuid';

export default {
  selectManagerUserByUsername: async username => {
    return await managerUser.findOne({
      where: { username },
      attributes: [
        'id',
        'uuid',
        'phone',
        'username',
        'password',
        'name',
        'role'
      ]
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
  }
};
