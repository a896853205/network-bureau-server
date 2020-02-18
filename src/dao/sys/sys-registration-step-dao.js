import sysRegistrationStep from '../../db/models/sys-registration-step';

export default {
  /**
   *  无参数查询sys_registration_step表
   */
  querySysRegistrationStep: () =>
    sysRegistrationStep.findAll({
      attributes: ['name', 'step']
    })
};
