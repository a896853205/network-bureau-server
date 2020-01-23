import enterpriseRegistration from '../../../db/models/enterprise-registration';
import sysRegistrationStep from '../../../db/models/sys-registration-step';

import { REGISTRATION_PAGE_SIZE } from '../../../config/system-config';


export default {

  /**
   *  无参数查询sys_registration_step表
   */
  querySysRegistrationStep: async () => {
    return await sysRegistrationStep.findAll({
      attributes: ['name', 'step']
    });
  },

  /**
   * 查询企业用户登记测试
   */
  queryRegistration: async (page) => {
    const result = await enterpriseRegistration.findAndCountAll({
      attributes: ['uuid', 'enterpriseUuid', 'name', 'currentStep'],
      limit: REGISTRATION_PAGE_SIZE,
      offset: (page - 1) * REGISTRATION_PAGE_SIZE,
      raw: true
    });
    console.log(result);
    console.log(1);

    return {
      enterpriseRegistrationList: result.rows,
      total: result.count,
      pageSize: REGISTRATION_PAGE_SIZE
    };
  }

};