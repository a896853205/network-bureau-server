import enterpriseDelegationDocument from '../../db/models/enterprise-delegation-document';

export default {
  /**
   * 新增用户文档集信息
   */
  insertDelegationDocument: ({ uuid, transaction = null }) =>
    enterpriseDelegationDocument.create(
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
  selectDelegationDocumentByDelegationUuid: ({
    delegationUuid,
    transaction
  }) =>
    enterpriseDelegationDocument.findOne({
      attributes: ['url', 'failText', 'status', 'statusText'],
      raw: true,
      where: { uuid: delegationUuid },
      transaction
    }),

  /**
   * 查询的登记测试的状态信息
   */
  selectDelegationDocumentStatusByDelegationUuid: ({
    delegationUuid,
    transaction
  }) =>
    enterpriseDelegationDocument.findOne({
      attributes: ['status'],
      raw: true,
      where: { uuid: delegationUuid },
      transaction
    }),

  /**
   * 查询的用户文档集url信息
   */
  selectDelegationDocumentUrlByDelegationUuid: delegationUuid =>
    enterpriseDelegationDocument.findOne({
      attributes: ['url'],
      raw: true,
      where: { uuid: delegationUuid }
    }),

  /**
   * 保存用户文档集信息
   */
  updateDelegationDocument: ({
    delegationUuid,
    documentUrl,
    status,
    statusText,
    failText,
    transaction = null
  }) =>
    enterpriseDelegationDocument.update(
      {
        url: documentUrl,
        status,
        statusText,
        failText
      },
      {
        where: { uuid: delegationUuid },
        raw: true,
        transaction
      }
    ),

  /**
   * 设置用户文档集的状态
   */
  updateDelegationDocumentStatus: ({
    delegationUuid,
    status,
    failText,
    statusText,
    transaction
  }) =>
    enterpriseDelegationDocument.update(
      { status, failText, statusText },
      {
        where: { uuid: delegationUuid },
        transaction
      }
    )
};
