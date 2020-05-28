import enterpriseDelegationProductDescription from '../../db/models/enterprise-delegation-product-description';

export default {
  /**
   * 新增产品说明信息
   */
  insertDelegationProductDescription: ({ uuid, transaction = null }) =>
    enterpriseDelegationProductDescription.create(
      {
        uuid,
        status: 0,
        statusText: '未上传'
      },
      { transaction }
    ),
  /**
   * 查询的产品说明信息
   */
  selectDelegationProductDescriptionByDelegationUuid: ({
    delegationUuid,
    transaction
  }) =>
    enterpriseDelegationProductDescription.findOne({
      attributes: ['url', 'failText', 'status', 'statusText'],
      raw: true,
      where: { uuid: delegationUuid },
      transaction
    }),

  /**
   * 查询的登记测试的状态信息
   */
  selectDelegationProductDescriptionStatusByDelegationUuid: ({
    delegationUuid,
    transaction
  }) =>
    enterpriseDelegationProductDescription.findOne({
      attributes: ['status'],
      raw: true,
      where: { uuid: delegationUuid },
      transaction
    }),

  /**
   * 查询的产品说明url信息
   */
  selectDelegationProductDescriptionUrlByDelegationUuid: delegationUuid =>
    enterpriseDelegationProductDescription.findOne({
      attributes: ['url'],
      raw: true,
      where: { uuid: delegationUuid }
    }),

  /**
   * 保存产品说明信息
   */
  updateDelegationProductDescription: ({
    delegationUuid,
    productDescriptionUrl,
    status,
    statusText,
    failText,
    transaction
  }) =>
    enterpriseDelegationProductDescription.update(
      {
        url: productDescriptionUrl,
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
   * 设置产品描述的状态
   */
  updateDelegationProductDescriptionStatus: ({
    delegationUuid,
    status,
    failText,
    statusText,
    transaction
  }) =>
    enterpriseDelegationProductDescription.update(
      { status, failText, statusText },
      {
        where: { uuid: delegationUuid },
        transaction
      }
    )
};
