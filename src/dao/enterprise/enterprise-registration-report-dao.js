import enterpriseRegistrationReport from '../../db/models/enterprise-registration-report';

export default {
  /**
   * 新增现场报告信息
   */
  insertRegistrationReport: ({ uuid, transaction = null }) =>
    enterpriseRegistrationReport.create(
      {
        uuid,
        status: 0
      },
      { transaction }
    ),

  /**
   * 查询现场报告信息
   */
  selectRegistrationReportByRegistrationUuid: registrationUuid =>
    enterpriseRegistrationReport.findOne({
      attributes: ['url', 'totalPage', 'failText'],
      raw: true,
      where: { uuid: registrationUuid }
    }),

  /**
   * 保存现场报告信息
   */
  updateRegistrationReport: ({
    registrationUuid,
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
  }) =>
    enterpriseRegistrationReport.update(
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
        where: { uuid: registrationUuid },
        raw: true
      }
    ),

  /**
   * 查询现场报告信息
   */
  selectRegistrationReportStatus: registrationUuid =>
    enterpriseRegistrationReport.findOne({
      attributes: ['status'],
      raw: true,
      where: { uuid: registrationUuid }
    }),

  /**
   * 查询现场报告状态信息
   */
  selectManagerRegistrationReportByRegistrationUuid: registrationUuid =>
    enterpriseRegistrationReport.findOne({
      attributes: ['url', 'status'],
      raw: true,
      where: { uuid: registrationUuid }
    }),

  /**
   * 查找现场报告url
   */
  selectProjectManagerRegistrationReport: registrationUuid =>
    enterpriseRegistrationReport.findOne({
      attributes: ['url', 'finalUrl'],
      raw: true,
      where: { uuid: registrationUuid }
    })
};
