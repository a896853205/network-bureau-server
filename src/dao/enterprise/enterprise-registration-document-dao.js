import enterpriseRegistrationDocument from '../../db/models/enterprise-registration-document';

export default {
  /**
   * 新增用户文档集信息
   */
  insertRegistrationDocument: ({ uuid, transaction = null }) =>
    enterpriseRegistrationDocument.create(
      {
        uuid,
        status: 0,
        statusText: '未上传'
      },
      {
        transaction
      }
    ),

  /**
   * 查询的用户文档集信息
   */
  selectRegistrationDocumentByRegistrationUuid: ({
    registrationUuid,
    transaction
  }) =>
    enterpriseRegistrationDocument.findOne({
      attributes: ['url', 'failText', 'status', 'statusText'],
      raw: true,
      where: { uuid: registrationUuid },
      transaction
    }),

  /**
   * 查询的用户文档集url信息
   */
  selectRegistrationDocumentUrlByRegistrationUuid: registrationUuid =>
    enterpriseRegistrationDocument.findOne({
      attributes: ['url'],
      raw: true,
      where: { uuid: registrationUuid }
    }),

  /**
   * 保存用户文档集信息
   */
  updateRegistrationDocument: ({
    registrationUuid,
    documentUrl,
    status,
    statusText,
    failText
  }) =>
    enterpriseRegistrationDocument.update(
      {
        url: documentUrl,
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
   * 设置用户文档集的状态
   */
  updateDocumentStatus: ({
    registrationUuid,
    status,
    failText,
    statusText,
    transaction
  }) =>
    enterpriseRegistrationDocument.update(
      { status, failText, statusText },
      {
        where: { uuid: registrationUuid },
        transaction
      }
    )
};
