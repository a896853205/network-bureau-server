import managerUser from '../../db/models/manager-user';

import uuid from 'uuid';

import { MANAGER_PAGE_SIZE } from '../../config/system-config';

export default {
  /**
   * 通过managerUuid查询管理员
   */
  selectManagerByManagerUuid: async managerUuid => {
    return await managerUser.findOne({
      where: { uuid: managerUuid },
      attributes: [
        'uuid',
        'phone',
        'username',
        'password',
        'name',
        'role',
        'headPortraitUrl',
        'star'
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
      headPortraitUrl,
      star: 5
    });
  },

  /**
   * 删除企业用户
   */
  deleteManager: async managerUuid => {
    return await managerUser.destroy({
      where: { uuid: managerUuid }
    });
  },

  /**
   * 更改企业用户
   */
  updeteManager: async (
    managerUuid,
    phone,
    password,
    name,
    headPortraitUrl
  ) => {
    return await managerUser.update(
      { phone, password, name, headPortraitUrl },
      {
        where: { uuid: managerUuid },
        raw: true
      }
    );
  },
  /**
   * 查询管理员用户
   */
  queryManagerUser: async page => {
    const result = await managerUser.findAndCountAll({
      attributes: ['uuid', 'username', 'phone', 'name', 'role', 'star'],
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
