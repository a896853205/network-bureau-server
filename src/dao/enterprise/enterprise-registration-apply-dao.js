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
    failManagerText,
    transaction
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
        raw: true,
        transaction
      }
    ),

  /**
   * 查询的现场测试申请表信息
   */
  selectRegistrationApplyByRegistrationUuid: ({
    registrationUuid,
    transaction
  }) =>
    enterpriseRegistrationApply.findOne({
      attributes: ['content', 'failText', 'status', 'statusText'],
      raw: true,
      where: { uuid: registrationUuid },
      transaction
    }),

  /**
   * 查询的登记测试的状态信息
   */
  selectRegistrationApplyStatusByRegistrationUuid: ({
    registrationUuid,
    transaction
  }) =>
    enterpriseRegistrationApply.findOne({
      attributes: ['status',],
      raw: true,
      where: { uuid: registrationUuid },
      transaction
    }),

  /**
   * 设置现场测试申请表的状态
   */
  updateApplyStatus: ({
    registrationUuid,
    status,
    failText,
    statusText,
    transaction
  }) =>
    enterpriseRegistrationApply.update(
      { status, failText, statusText },
      {
        where: { uuid: registrationUuid },
        transaction
      }
    ),

  /**
   * 设置现场测试申请表的状态和审核不通过理由
   */
  updateApplyManagerStatus: ({
    registrationUuid,
    failManagerText,
    techManagerDate,
    certifierManagerUuid,
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
        certifierManagerUuid,
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
    }),

  /**
   * 查询样品登记表管理员审核状态
   */
  selectRegistrationApplyManagerStatus: ({ registrationUuid, transaction }) =>
    enterpriseRegistrationApply.findOne({
      attributes: ['managerStatus'],
      raw: true,
      where: { uuid: registrationUuid },
      transaction
    })
};
