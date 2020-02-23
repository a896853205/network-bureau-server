import enterpriseRegistrationOriginalRecord from '../../db/models/enterprise-registration-original-record';

export default {
  /**
   * 新增现场记录信息
   */
  insertRegistrationRecord: ({ uuid, transaction = null }) =>
    enterpriseRegistrationOriginalRecord.create(
      {
        uuid,
        status: 0
      },
      { transaction }
    ),

  /**
   * 查询现场记录信息
   */
  selectRegistrationRecordByRegistrationUuid: registrationUuid =>
    enterpriseRegistrationOriginalRecord.findOne({
      attributes: ['url', 'totalPage', 'failText'],
      raw: true,
      where: { uuid: registrationUuid }
    }),

  /**
   * 保存产品介质信息
   */
  updateRegistrationRecord: ({
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
    enterpriseRegistrationOriginalRecord.update(
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
   * 查询现场记录状态信息
   */
  selectRegistrationRecordStatus: registrationUuid =>
    enterpriseRegistrationOriginalRecord.findOne({
      attributes: ['status'],
      raw: true,
      where: { uuid: registrationUuid }
    }),

  /**
   * 查询现场记录状态信息
   */
  selectManagerRegistrationRecordByRegistrationUuid: registrationUuid =>
    enterpriseRegistrationOriginalRecord.findOne({
      attributes: ['url', 'status'],
      raw: true,
      where: { uuid: registrationUuid }
    }),

  /**
   * 查找原始记录url
   */
  selectProjectManagerRegistrationRecord: registrationUuid =>
    enterpriseRegistrationOriginalRecord.findOne({
      attributes: ['url', 'finalUrl'],
      raw: true,
      where: { uuid: registrationUuid }
    })
};
