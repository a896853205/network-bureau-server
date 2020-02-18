import enterpriseRegistrationProduct from '../../db/models/enterprise-registration-product';

export default {
  /**
   * 新增产品介质信息
   */
  insertRegistrationProduct: ({ uuid, transaction = null }) =>
    enterpriseRegistrationProduct.create(
      {
        uuid,
        status: 0,
        statusText: '未上传'
      },
      { transaction }
    ),
  /**
   * 查询的产品介质信息
   */
  selectRegistrationProductByRegistrationUuid: registrationUuid =>
    enterpriseRegistrationProduct.findOne({
      attributes: ['url', 'failText', 'status', 'statusText'],
      raw: true,
      where: { uuid: registrationUuid }
    }),

  /**
   * 查询的产品介质url信息
   */
  selectRegistrationProductUrlByRegistrationUuid: registrationUuid =>
    enterpriseRegistrationProduct.findOne({
      attributes: ['url'],
      raw: true,
      where: { uuid: registrationUuid }
    }),

  /**
   * 保存产品介质信息
   */
  updateRegistrationProduct: ({
    registrationUuid,
    productUrl,
    status,
    statusText,
    failText
  }) =>
    enterpriseRegistrationProduct.update(
      {
        url: productUrl,
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
   * 设置产品介质的状态
   */
  updateProductStatus: ({ registrationUuid, status, failText, statusText }) =>
    enterpriseRegistrationProduct.update(
      { status, failText, statusText },
      {
        where: { uuid: registrationUuid }
      }
    )
};
