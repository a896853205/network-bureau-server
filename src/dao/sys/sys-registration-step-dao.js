import sysRegistrationStep from '../../db/models/sys-registration-step';

export default {
  /**
   *  无参数查询sys_registration_step表
   */
  querySysRegistrationStep: async () => {
    return await sysRegistrationStep.findAll({
      attributes: ['name', 'step']
    });
  }
};
