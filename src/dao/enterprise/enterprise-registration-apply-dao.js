import enterpriseRegistrationApply from '../../db/models/enterprise-registration-apply';

export default {
  /**
   * 新增现场申请表信息
   */
  insertRegistrationApply: ({ uuid, transaction = null }) =>
    enterpriseRegistrationApply.create(
      {
        uuid,
        status: 0,
        statusText: '未填写'
      },
      {
        transaction
      }
    ),
  /**
   * 保存现场测试申请表信息
   */
  updateRegistrationApply: ({
    registrationUuid,
    content,
    status,
    statusText,
    failText
  }) =>
    enterpriseRegistrationApply.update(
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
    ),

  /**
   * 查询的现场测试申请表信息
   */
  selectRegistrationApplyByRegistrationUuid: registrationUuid =>
    enterpriseRegistrationApply.findOne({
      attributes: ['content', 'failText', 'status', 'statusText'],
      raw: true,
      where: { uuid: registrationUuid }
    }),

  /**
   * 设置现场测试申请表的状态
   */
  updateApplyStatus: ({ registrationUuid, status, failText, statusText }) =>
    enterpriseRegistrationApply.update(
      { status, failText, statusText },
      {
        where: { uuid: registrationUuid }
      }
    ),

  /**
   * 设置现场测试申请表的管理员状态
   */
  updateApplyManagerStatus: ({
    registrationUuid,
    managerStatus,
    transaction = null
  }) =>
    enterpriseRegistrationApply.update(
      { managerStatus },
      {
        where: { uuid: registrationUuid },
        transaction
      }
    ),
  /**
   * 设置现场测试申请表的管理员uuid
   */
  updateApplyManagerUuid: ({
    registrationUuid,
    techLeaderManagerUuid,
    techManagerUuid,
    certifierManagerUuid,
    transaction = null
  }) =>
    enterpriseRegistrationApply.update(
      {
        techLeaderManagerUuid,
        techManagerUuid,
        certifierManagerUuid
      },
      {
        where: { uuid: registrationUuid },
        transaction
      }
    )
};
