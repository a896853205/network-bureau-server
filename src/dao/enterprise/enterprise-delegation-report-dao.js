import enterpriseDelegationReport from '../../db/models/enterprise-delegation-report';

export default {
  /**
   * 新增现场报告信息
   */
  insertDelegationReport: ({ uuid, transaction = null }) =>
    enterpriseDelegationReport.create(
      {
        uuid,
        status: 0
      },
      { transaction }
    ),

  /**
   * 查询现场报告信息
   */
  selectDelegationReportByDelegationUuid: delegationUuid =>
    enterpriseDelegationReport.findOne({
      attributes: ['url', 'totalPage', 'failText'],
      raw: true,
      where: { uuid: delegationUuid }
    }),

  /**
   * 保存现场报告信息
   */
  updateDelegationReport: ({
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
    enterpriseDelegationReport.update(
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
   * 查询现场报告信息
   */
  selectDelegationReportStatus: ({ delegationUuid, transaction = null }) =>
    enterpriseDelegationReport.findOne({
      attributes: ['status'],
      raw: true,
      where: { uuid: delegationUuid },
      transaction
    }),

  /**
   * 查询现场报告状态信息
   */
  selectManagerDelegationReportByDelegationUuid: ({
    delegationUuid,
    transaction
  }) =>
    enterpriseDelegationReport.findOne({
      attributes: ['url', 'status'],
      raw: true,
      where: { uuid: delegationUuid },
      transaction
    }),

  /**
   * 查找现场报告url
   */
  selectProjectManagerDelegationReport: ({
    delegationUuid,
    transaction
  }) => {
    return enterpriseDelegationReport.findOne({
      attributes: ['url', 'finalUrl'],
      raw: true,
      where: { uuid: delegationUuid },
      transaction
    });
  },

  /**
   * 查找现场报告url
   */
  selectEnterpriseDelegationReport: delegationUuid =>
    enterpriseDelegationReport.findOne({
      attributes: ['finalUrl'],
      raw: true,
      where: { uuid: delegationUuid }
    })
};
