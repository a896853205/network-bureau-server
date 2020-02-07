import enterpriseRegistrationProductDescription from '../../db/models/enterprise-registration-product-description';

export default {
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
  saveRegistrationProductDescription: async ({
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
  setProductDescriptionStatus: async ({
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
