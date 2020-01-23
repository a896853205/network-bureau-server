import superManagerUserDao from '../../../dao/manager/super-manager/index.js';

export default {

  /**
   *  无参数查询sys_registration_step表
   */
  querySysRegistrationStep: async () => {
    return await superManagerUserDao.querySysRegistrationStep();
  },
  /**
   * 查询登记测试
   */
  queryRegistration: async (page) => {
    return await superManagerUserDao.queryRegistration(
      page
    );
  }
};