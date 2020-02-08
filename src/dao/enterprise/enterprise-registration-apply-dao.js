import enterpriseRegistrationApply from '../../db/models/enterprise-registration-apply';

export default {
  /**
   * 保存现场测试申请表的基本信息
   */
  updateRegistrationApply: async ({
    registrationUuid,
    content,
    status,
    statusText,
    failText
  }) => {
    // 这里还得更新状态信息为2待审核
    return await enterpriseRegistrationApply.update(
      {
        content,
        status,
        statusText,
        failText
      },
      {
        where: { uuid: registrationUuid },
        raw: true
      }
    );
  },

  /**
   * 查询的现场测试申请表信息
   */
  selectRegistrationApplyByRegistrationUuid: async registrationUuid => {
    return await enterpriseRegistrationApply.findOne({
      attributes: ['content', 'failText', 'status', 'statusText'],
      raw: true,
      where: { uuid: registrationUuid }
    });
  },

  /**
   * 设置现场测试申请表的状态
   */
  updateApplyStatus: async ({
    registrationUuid,
    status,
    failText,
    statusText
  }) => {
    return await enterpriseRegistrationApply.update(
      { status, failText, statusText },
      {
        where: { uuid: registrationUuid }
      }
    );
  }
};
