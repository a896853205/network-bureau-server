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
    failText,
    transaction
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
        raw: true,
        transaction
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
  selectManagerRegistrationRecordByRegistrationUuid: ({
    registrationUuid,
    transaction
  }) =>
    enterpriseRegistrationOriginalRecord.findOne({
      attributes: ['url', 'status'],
      raw: true,
      where: { uuid: registrationUuid },
      transaction
    }),

  /**
   * 查找原始记录url
   */
  selectProjectManagerRegistrationRecord: registrationUuid =>
    enterpriseRegistrationOriginalRecord.findOne({
      attributes: ['url', 'finalUrl'],
      raw: true,
      where: { uuid: registrationUuid }
    }),

  /**
   * 查找原始记录url
   */
  selectEnterpriseRegistrationRecord: registrationUuid =>
    enterpriseRegistrationOriginalRecord.findOne({
      attributes: ['finalUrl'],
      raw: true,
      where: { uuid: registrationUuid }
    })
};
