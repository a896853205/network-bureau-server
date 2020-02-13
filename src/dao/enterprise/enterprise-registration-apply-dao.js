import enterpriseRegistrationApply from '../../db/models/enterprise-registration-apply';

export default {
  /**
   * 新增现场申请表信息
   */
  insertRegistrationApply: ({ uuid, transaction = null }) => {
    return enterpriseRegistrationApply.create(
      {
        uuid,
        status: 0,
        statusText: '未填写'
      },
      {
        transaction
      }
    );
  },
  /**
   * 保存现场测试申请表信息
   */
  updateRegistrationApply: ({
    registrationUuid,
    content,
    status,
    statusText,
    failText
  }) => {
    // 这里还得更新状态信息为2待审核
    return enterpriseRegistrationApply.update(
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
  selectRegistrationApplyByRegistrationUuid: registrationUuid => {
    return enterpriseRegistrationApply.findOne({
      attributes: ['content', 'failText', 'status', 'statusText'],
      raw: true,
      where: { uuid: registrationUuid }
    });
  },

  /**
   * 设置现场测试申请表的状态
   */
  updateApplyStatus: ({ registrationUuid, status, failText, statusText }) => {
    return enterpriseRegistrationApply.update(
      { status, failText, statusText },
      {
        where: { uuid: registrationUuid }
      }
    );
  }
};
