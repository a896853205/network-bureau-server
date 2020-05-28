import enterpriseDelegationApply from '../../db/models/enterprise-delegation-apply';

export default {
  /**
   * 新增现场申请表信息
   */
  insertDelegationApply: ({ uuid, transaction = null }) =>
    enterpriseDelegationApply.create(
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
  updateDelegationApply: ({
    delegationUuid,
    content,
    status,
    statusText,
    failText,
    managerStatus,
    failManagerText,
    transaction
  }) =>
    enterpriseDelegationApply.update(
      {
        content,
        status,
        statusText,
        failText,
        managerStatus,
        failManagerText
      },
      {
        where: { uuid: delegationUuid },
        raw: true,
        transaction
      }
    ),

  /**
   * 查询的现场测试申请表信息
   */
  selectDelegationApplyByDelegationUuid: ({
    delegationUuid,
    transaction
  }) =>
    enterpriseDelegationApply.findOne({
      attributes: ['content', 'failText', 'status', 'statusText'],
      raw: true,
      where: { uuid: delegationUuid },
      transaction
    }),

  /**
   * 查询的登记测试的状态信息
   */
  selectDelegationApplyStatusByDelegationUuid: ({
    delegationUuid,
    transaction
  }) =>
    enterpriseDelegationApply.findOne({
      attributes: ['status',],
      raw: true,
      where: { uuid: delegationUuid },
      transaction
    }),

  /**
   * 设置现场测试申请表的状态
   */
  updateDelegationApplyStatus: ({
    delegationUuid,
    status,
    failText,
    statusText,
    transaction
  }) =>
    enterpriseDelegationApply.update(
      { status, failText, statusText },
      {
        where: { uuid: delegationUuid },
        transaction
      }
    ),

  /**
   * 设置现场测试申请表的状态和审核不通过理由
   */
  updateDelegationApplyManagerStatus: ({
    delegationUuid,
    failManagerText,
    techManagerDate,
    certifierManagerUuid,
    certifierManagerDate,
    techLeaderManagerDate,
    managerStatus,
    transaction
  }) =>
    enterpriseDelegationApply.update(
      {
        failManagerText,
        managerStatus,
        techManagerDate,
        certifierManagerDate,
        certifierManagerUuid,
        techLeaderManagerDate
      },
      {
        where: { uuid: delegationUuid },
        transaction
      }
    ),

  /**
   * 设置现场测试申请表的管理员uuid
   */
  updateDelegationApplyManagerUuid: ({
    delegationUuid,
    techLeaderManagerUuid,
    techManagerUuid,
    certifierManagerUuid,
    transaction = null
  }) =>
    enterpriseDelegationApply.update(
      {
        techLeaderManagerUuid,
        techManagerUuid,
        certifierManagerUuid
      },
      {
        where: { uuid: delegationUuid },
        transaction
      }
    ),

  /**
   * 查询的现场测试申请表信息
   */
  selectDelegationTestApply: ({ delegationUuid, transaction }) =>
    enterpriseDelegationApply.findOne({
      attributes: ['content', 'failManagerText', 'managerStatus'],
      raw: true,
      where: { uuid: delegationUuid },
      transaction
    }),

  /**
   * 查询样品登记表管理员审核状态
   */
  selectDelegationApplyManagerStatus: ({ delegationUuid, transaction }) =>
    enterpriseDelegationApply.findOne({
      attributes: ['managerStatus'],
      raw: true,
      where: { uuid: delegationUuid },
      transaction
    })
};
