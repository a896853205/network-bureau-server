import enterpriseDelegationOriginalRecord from '../../db/models/enterprise-delegation-original-record';

export default {
  /**
   * 新增现场记录信息
   */
  insertDelegationRecord: ({ uuid, transaction = null }) =>
    enterpriseDelegationOriginalRecord.create(
      {
        uuid,
        status: 0
      },
      { transaction }
    ),

  /**
   * 查询现场记录信息
   */
  selectDelegationRecordByDelegationUuid: ({
    delegationUuid,
    transaction = null
  }) =>
    enterpriseDelegationOriginalRecord.findOne({
      attributes: ['url', 'totalPage', 'failText'],
      raw: true,
      where: { uuid: delegationUuid },
      transaction
    }),

  /**
   * 保存样品信息
   */
  updateDelegationRecord: ({
    delegationUuid,
    url,
    status,
    totalPage,
    techManagerUuid,
    techManagerDate,
    techLeaderManagerUuid,
    techLeaderManagerDate,
    certifierManagerUuid,
    certifierManagerDate,
    finalUrl,
    projectManagerUuid,
    projectManagerDate,
    failText,
    transaction
  }) =>
    enterpriseDelegationOriginalRecord.update(
      {
        url,
        status,
        totalPage,
        techManagerUuid,
        techManagerDate,
        techLeaderManagerUuid,
        techLeaderManagerDate,
        certifierManagerUuid,
        certifierManagerDate,
        finalUrl,
        projectManagerUuid,
        projectManagerDate,
        failText
      },
      {
        where: { uuid: delegationUuid },
        raw: true,
        transaction
      }
    ),

  /**
   * 查询现场记录状态信息
   */
  selectDelegationRecordStatus: ({ delegationUuid, transaction = null }) =>
    enterpriseDelegationOriginalRecord.findOne({
      attributes: ['status'],
      raw: true,
      where: { uuid: delegationUuid },
      transaction
    }),

  /**
   * 查询现场记录状态信息
   */
  selectManagerDelegationRecordByDelegationUuid: ({
    delegationUuid,
    transaction
  }) =>
    enterpriseDelegationOriginalRecord.findOne({
      attributes: ['url', 'status'],
      raw: true,
      where: { uuid: delegationUuid },
      transaction
    }),

  /**
   * 查找原始记录url
   */
  selectProjectManagerDelegationRecord: ({
    delegationUuid,
    transaction
  }) => {
    return enterpriseDelegationOriginalRecord.findOne({
      attributes: ['url', 'finalUrl'],
      raw: true,
      where: { uuid: delegationUuid },
      transaction
    });
  },

  /**
   * 查找原始记录url
   */
  selectEnterpriseDelegationRecord: delegationUuid =>
    enterpriseDelegationOriginalRecord.findOne({
      attributes: ['finalUrl'],
      raw: true,
      where: { uuid: delegationUuid }
    })
};
