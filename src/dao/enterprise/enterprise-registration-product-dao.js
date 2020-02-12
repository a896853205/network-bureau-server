import enterpriseRegistrationProduct from '../../db/models/enterprise-registration-product';

export default {
  /**
   * 新增产品介质信息
   */
  insertRegistrationProduct: ({ uuid, transaction }) => {
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
  selectRegistrationProductByRegistrationUuid: async registrationUuid => {
    return await enterpriseRegistrationProduct.findOne({
      attributes: ['url', 'failText', 'status', 'statusText'],
      raw: true,
      where: { uuid: registrationUuid }
    });
  },

  /**
   * 保存产品介质信息
   */
  updateRegistrationProduct: async ({
    registrationUuid,
    productUrl,
    status,
    statusText,
    failText
  }) => {
    // 这里还得更新状态信息为2待审核
    return await enterpriseRegistrationProduct.update(
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
  updateProductStatus: async ({
    registrationUuid,
    status,
    failText,
    statusText
  }) => {
    return await enterpriseRegistrationProduct.update(
      { status, failText, statusText },
      {
        where: { uuid: registrationUuid }
      }
    );
  }
};
