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
    failText,
    managerStatus,
    failManagerText
  }) =>
    enterpriseRegistrationApply.update(
      {
        content,
        status,
        statusText,
        failText,
        managerStatus,
        failManagerText
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
   * 设置现场测试申请表的状态和审核不通过理由
   */
  updateApplyManagerStatus: ({
    registrationUuid,
    failManagerText,
    techManagerDate,
    certifierManagerDate,
    techLeaderManagerDate,
    managerStatus,
    transaction
  }) =>
    enterpriseRegistrationApply.update(
      {
        failManagerText,
        managerStatus,
        techManagerDate,
        certifierManagerDate,
        techLeaderManagerDate
      },
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
    ),

  /**
   * 查询的现场测试申请表信息
   */
  selectRegistrationTestApply: ({ registrationUuid, transaction }) =>
    enterpriseRegistrationApply.findOne({
      attributes: ['content', 'failManagerText', 'managerStatus'],
      raw: true,
      where: { uuid: registrationUuid },
      transaction
    })
};
