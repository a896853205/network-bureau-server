import enterpriseDelegationProduct from '../../db/models/enterprise-delegation-product';

export default {
  /**
   * 新增样品信息
   */
  insertDelegationProduct: ({ uuid, transaction = null }) =>
    enterpriseDelegationProduct.create(
      {
        uuid,
        status: 0,
        statusText: '未上传'
      },
      { transaction }
    ),
  /**
   * 查询的样品信息
   */
  selectDelegationProductByDelegationUuid: ({
    delegationUuid,
    transaction
  }) =>
    enterpriseDelegationProduct.findOne({
      attributes: ['url', 'failText', 'status', 'statusText'],
      raw: true,
      where: { uuid: delegationUuid },
      transaction
    }),

  /**
   * 查询的登记测试的状态信息
   */
  selectDelegationProductStatusByDelegationUuid: ({
    delegationUuid,
    transaction
  }) =>
    enterpriseDelegationProduct.findOne({
      attributes: ['status'],
      raw: true,
      where: { uuid: delegationUuid },
      transaction
    }),

  /**
   * 查询的样品url信息
   */
  selectDelegationProductUrlByDelegationUuid: delegationUuid =>
    enterpriseDelegationProduct.findOne({
      attributes: ['url'],
      raw: true,
      where: { uuid: delegationUuid }
    }),

  /**
   * 保存样品信息
   */
  updateDelegationProduct: ({
    delegationUuid,
    productUrl,
    status,
    statusText,
    failText,
    transaction
  }) =>
    enterpriseDelegationProduct.update(
      {
        url: productUrl,
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
   * 设置样品的状态
   */
  updateDelegationProductStatus: ({
    delegationUuid,
    status,
    failText,
    statusText,
    transaction
  }) =>
    enterpriseDelegationProduct.update(
      { status, failText, statusText },
      {
        where: { uuid: delegationUuid },
        transaction
      }
    )
};
