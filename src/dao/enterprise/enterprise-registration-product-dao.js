import enterpriseRegistrationProduct from '../../db/models/enterprise-registration-product';

export default {
  /**
   * 新增产品介质信息
   */
  insertRegistrationProduct: ({ uuid, transaction = null }) => {
    return enterpriseRegistrationProduct.create(
      {
        uuid,
        status: 0,
        statusText: '未上传'
      },
      { transaction }
    );
  },
  /**
   * 查询的产品介质信息
   */
  selectRegistrationProductByRegistrationUuid: registrationUuid => {
    return enterpriseRegistrationProduct.findOne({
      attributes: ['url', 'failText', 'status', 'statusText'],
      raw: true,
      where: { uuid: registrationUuid }
    });
  },

  /**
   * 查询的产品介质url信息
   */
  selectRegistrationProductUrlByRegistrationUuid: registrationUuid => {
    return enterpriseRegistrationProduct.findOne({
      attributes: ['url'],
      raw: true,
      where: { uuid: registrationUuid }
    });
  },

  /**
   * 保存产品介质信息
   */
  updateRegistrationProduct: ({
    registrationUuid,
    productUrl,
    status,
    statusText,
    failText
  }) => {
    // 这里还得更新状态信息为2待审核
    return enterpriseRegistrationProduct.update(
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
    );
  },

  /**
   * 设置产品介质的状态
   */
  updateProductStatus: ({ registrationUuid, status, failText, statusText }) => {
    return enterpriseRegistrationProduct.update(
      { status, failText, statusText },
      {
        where: { uuid: registrationUuid }
      }
    );
  }
};
