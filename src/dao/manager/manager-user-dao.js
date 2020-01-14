import managerUser from '../../db/models/manager-user';

import uuid from 'uuid';

import { MANAGER_PAGE_SIZE } from '../../config/system-config';

export default {
  /**
   * 通过uuid查询管理员
   */
  selectManagerByUuid: async uuid => {
    return await managerUser.findOne({
      where: { uuid },
      attributes: [
        'uuid',
        'phone',
        'username',
        'password',
        'name',
        'role',
        'headPortraitUrl'
      ],
      raw: true
    });
  },
  /**
   * 通过用户名查询管理员
   */
  selectManagerUserByUsername: async username => {
    return await managerUser.findOne({
      where: { username },
      attributes: ['uuid', 'phone', 'username', 'password', 'name', 'role'],
      raw: true
    });
  },
  /**
   * 通过权限查一个管理员
   */
  selectManagerUserByRole: async role => {
    return await managerUser.findOne({
      where: { role },
      attributes: ['uuid', 'phone', 'username', 'password', 'name', 'role'],
      raw: true
    });
  },
  /**
   * 创建管理员
   */
  createNewManagerUser: async (
    username,
    phone,
    password,
    name,
    role,
    headPortraitUrl
  ) => {
    return await managerUser.create({
      username,
      password,
      phone,
      name,
      role,
      uuid: uuid.v1(),
      headPortraitUrl
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
  updeteManager: async (uuid, phone, password, name, headPortraitUrl) => {
    return await managerUser.update(
      { phone, password, name, headPortraitUrl },
      {
        where: { uuid },
        raw: true
      }
    );
  },
  /**
   * 查询管理员用户
   */
  queryManagerUser: async page => {
    const result = await managerUser.findAndCountAll({
      attributes: ['uuid', 'username', 'phone', 'name', 'role'],
      limit: MANAGER_PAGE_SIZE,
      offset: (page - 1) * MANAGER_PAGE_SIZE,
      raw: true
    });

    return {
      managerList: result.rows,
      total: result.count,
      pageSize: MANAGER_PAGE_SIZE
    };
  }
};
