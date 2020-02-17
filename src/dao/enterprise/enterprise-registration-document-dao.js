import enterpriseRegistrationDocument from '../../db/models/enterprise-registration-document';

export default {
  /**
   * 新增用户文档集信息
   */
  insertRegistrationDocument: ({ uuid, transaction = null }) => {
    return enterpriseRegistrationDocument.create(
      {
        uuid,
        status: 0,
        statusText: '未上传'
      },
      {
        transaction
      }
    );
  },

  /**
   * 查询的用户文档集信息
   */
  selectRegistrationDocumentByRegistrationUuid: registrationUuid => {
    return enterpriseRegistrationDocument.findOne({
      attributes: ['url', 'failText', 'status', 'statusText'],
      raw: true,
      where: { uuid: registrationUuid }
    });
  },

  /**
   * 查询的用户文档集url信息
   */
  selectRegistrationDocumentUrlByRegistrationUuid: registrationUuid => {
    return enterpriseRegistrationDocument.findOne({
      attributes: ['url'],
      raw: true,
      where: { uuid: registrationUuid }
    });
  },

  /**
   * 保存用户文档集信息
   */
  updateRegistrationDocument: ({
    registrationUuid,
    documentUrl,
    status,
    statusText,
    failText
  }) => {
    // 这里还得更新状态信息为2待审核
    return enterpriseRegistrationDocument.update(
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
    );
  },

  /**
   * 设置用户文档集的状态
   */
  updateDocumentStatus: ({
    registrationUuid,
    status,
    failText,
    statusText
  }) => {
    return enterpriseRegistrationDocument.update(
      { status, failText, statusText },
      {
        where: { uuid: registrationUuid }
      }
    );
  }
};
