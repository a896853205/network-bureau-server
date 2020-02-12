import enterpriseRegistrationDocument from '../../db/models/enterprise-registration-document';

export default {
  /**
   * 新增用户文档集信息
   */
  insertRegistrationDocument: async registrationUuid => {
    return await enterpriseRegistrationDocument.create({
      uuid: registrationUuid,
      status: 0,
      statusText: '未上传'
    });
  },

  /**
   * 查询的用户文档集信息
   */
  selectRegistrationDocumentByRegistrationUuid: async registrationUuid => {
    return await enterpriseRegistrationDocument.findOne({
      attributes: ['url', 'failText', 'status', 'statusText'],
      raw: true,
      where: { uuid: registrationUuid }
    });
  },

  /**
   * 保存用户文档集信息
   */
  updateRegistrationDocument: async ({
    registrationUuid,
    documentUrl,
    status,
    statusText,
    failText
  }) => {
    // 这里还得更新状态信息为2待审核
    return await enterpriseRegistrationDocument.update(
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
  updateDocumentStatus: async ({
    registrationUuid,
    status,
    failText,
    statusText
  }) => {
    return await enterpriseRegistrationDocument.update(
      { status, failText, statusText },
      {
        where: { uuid: registrationUuid }
      }
    );
  }
};
