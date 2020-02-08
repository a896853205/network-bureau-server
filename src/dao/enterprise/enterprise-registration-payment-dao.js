import enterpriseRegistrationPayment from '../../db/models/enterprise-registration-payment';

export default {
  /**
   * 更新登记测试的步骤
   */
  updatePaymentStatus: async ({ registrationUuid, status }) => {
    return await enterpriseRegistrationPayment.update(
      {
        status
      },
      {
        where: {
          uuid: registrationUuid
        }
      }
    );
  },

  selectPaymentStatus: async registrationUuid => {
    return await enterpriseRegistrationPayment.findOne({
      attributes: ['status'],
      raw: true,
      where: { uuid: registrationUuid }
    });
  }
};
