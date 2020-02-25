import managerUser from '../../db/models/manager-user';

import uuid from 'uuid';

import { MANAGER_PAGE_SIZE } from '../../config/system-config';

export default {
  /**
   * 通过managerUuid查询管理员
   */
  selectManagerByManagerUuid: managerUuid =>
    managerUser.findOne({
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
    }),
  /**
   * 通过managerUuid查询管理员
   */
  selectManagerByManagerUuidAndRole: ({ managerUuid, role }) =>
    managerUser.findOne({
      where: { uuid: managerUuid, role: role },
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
    }),
  /**
   * 通过用户名查询管理员
   */
  selectManagerUserByUsername: username =>
    managerUser.findOne({
      where: { username },
      attributes: ['uuid', 'phone', 'username', 'password', 'name', 'role'],
      raw: true
    }),
  /**
   * 通过权限查一个管理员
   */
  selectManagerUserByRole: ({ role, transaction = null }) =>
    managerUser.findOne({
      where: { role },
      transaction,
      attributes: ['uuid', 'phone', 'username', 'password', 'name', 'role'],
      raw: true
    }),
  /**
   * 创建管理员
   */
  createNewManagerUser: (
    username,
    phone,
    password,
    name,
    role,
    headPortraitUrl
  ) =>
    managerUser.create({
      username,
      password,
      phone,
      name,
      role,
      uuid: uuid.v1(),
      headPortraitUrl,
      star: 5
    }),

  /**
   * 删除企业用户
   */
  deleteManager: managerUuid =>
    managerUser.destroy({
      where: { uuid: managerUuid }
    }),
  /**
   * 更改企业用户
   */
  updeteManager: (managerUuid, phone, password, name, headPortraitUrl) =>
    managerUser.update(
      { phone, password, name, headPortraitUrl },
      {
        where: { uuid: managerUuid },
        raw: true
      }
    ),
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
  },

  /**
   * 查询财务管理员用户
   */
  queryFinanceManagerUser: async page => {
    const result = await managerUser.findAndCountAll({
      attributes: ['uuid', 'username', 'phone', 'name', 'role', 'star'],
      limit: MANAGER_PAGE_SIZE,
      where: { role: 5 },
      offset: (page - 1) * MANAGER_PAGE_SIZE,
      raw: true
    });

    return {
      financeManagerList: result.rows,
      total: result.count,
      pageSize: MANAGER_PAGE_SIZE
    };
  },

  /**
   * 查询技术负责人
   */
  queryTechnicalManagerUser: async page => {
    const result = await managerUser.findAndCountAll({
      attributes: ['uuid', 'username', 'phone', 'name', 'role', 'star'],
      limit: MANAGER_PAGE_SIZE,
      where: { role: 15 },
      offset: (page - 1) * MANAGER_PAGE_SIZE,
      raw: true
    });

    return {
      technicalManagerList: result.rows,
      total: result.count,
      pageSize: MANAGER_PAGE_SIZE
    };
  },

  /**
   * 查询技术人员
   */
  queryTechManagerUser: async page => {
    const result = await managerUser.findAndCountAll({
      attributes: ['uuid', 'username', 'phone', 'name', 'role', 'star'],
      limit: MANAGER_PAGE_SIZE,
      where: { role: 20 },
      offset: (page - 1) * MANAGER_PAGE_SIZE,
      raw: true
    });

    return {
      techManagerList: result.rows,
      total: result.count,
      pageSize: MANAGER_PAGE_SIZE
    };
  }
};
