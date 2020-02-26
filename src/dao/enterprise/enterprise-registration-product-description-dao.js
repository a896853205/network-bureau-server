import enterpriseRegistrationProductDescription from '../../db/models/enterprise-registration-product-description';

export default {
  /**
   * 新增产品说明信息
   */
  insertRegistrationProductDescription: ({ uuid, transaction = null }) =>
    enterpriseRegistrationProductDescription.create(
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
  selectRegistrationProductDescriptionByRegistrationUuid: ({
    registrationUuid,
    transaction
  }) =>
    enterpriseRegistrationProductDescription.findOne({
      attributes: ['url', 'failText', 'status', 'statusText'],
      raw: true,
      where: { uuid: registrationUuid },
      transaction
    }),

  /**
   * 查询的产品说明url信息
   */
  selectRegistrationProductDescriptionUrlByRegistrationUuid: registrationUuid =>
    enterpriseRegistrationProductDescription.findOne({
      attributes: ['url'],
      raw: true,
      where: { uuid: registrationUuid }
    }),

  /**
   * 保存产品说明信息
   */
  updateRegistrationProductDescription: ({
    registrationUuid,
    productDescriptionUrl,
    status,
    statusText,
    failText
  }) =>
    enterpriseRegistrationProductDescription.update(
      {
        url: productDescriptionUrl,
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
   * 设置产品描述的状态
   */
  updateProductDescriptionStatus: ({
    registrationUuid,
    status,
    failText,
    statusText,
    transaction
  }) =>
    enterpriseRegistrationProductDescription.update(
      { status, failText, statusText },
      {
        where: { uuid: registrationUuid },
        transaction
      }
    )
};
