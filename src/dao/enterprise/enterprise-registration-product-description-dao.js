import enterpriseRegistrationProductDescription from '../../db/models/enterprise-registration-product-description';

export default {
  /**
   * 新增产品说明信息
   */
  insertRegistrationProductDescription: ({ uuid, transaction = null }) => {
    return enterpriseRegistrationProductDescription.create(
      {
        uuid,
        status: 0,
        statusText: '未上传'
      },
      { transaction }
    );
  },
  /**
   * 查询的产品说明信息
   */
  selectRegistrationProductDescriptionByRegistrationUuid: async registrationUuid => {
    return await enterpriseRegistrationProductDescription.findOne({
      attributes: ['url', 'failText', 'status', 'statusText'],
      raw: true,
      where: { uuid: registrationUuid }
    });
  },

  /**
   * 保存产品说明信息
   */
  updateRegistrationProductDescription: async ({
    registrationUuid,
    productDescriptionUrl,
    status,
    statusText,
    failText
  }) => {
    // 这里还得更新状态信息为2待审核
    return await enterpriseRegistrationProductDescription.update(
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
    );
  },

  /**
   * 设置产品描述的状态
   */
  updateProductDescriptionStatus: async ({
    registrationUuid,
    status,
    failText,
    statusText
  }) => {
    return await enterpriseRegistrationProductDescription.update(
      { status, failText, statusText },
      {
        where: { uuid: registrationUuid }
      }
    );
  }
};
