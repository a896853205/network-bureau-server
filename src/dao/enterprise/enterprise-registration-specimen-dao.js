import enterpriseRegistrationStep from '../../db/models/enterprise-registration-step';
import enterpriseRegistrationSpecimen from '../../db/models/enterprise-registration-specimen';

export default {
  /**
   * 查询的样品登记表的基本信息
   */
  selectRegistrationSpecimenByRegistrationUuid: async registrationUuid => {
    return await enterpriseRegistrationSpecimen.findOne({
      attributes: [
        'trademark',
        'developmentTool',
        'securityClassification',
        'email',
        'unit',
        'failText',
        'status',
        'statusText'
      ],
      raw: true,
      where: { uuid: registrationUuid }
    });
  },

  /**
   * 保存样品登记表的基本信息
   */
  saveRegistrationSpecimen: async ({
    registrationUuid,
    trademark,
    developmentTool,
    securityClassification,
    email,
    unit,
    status,
    statusText,
    failText
  }) => {
    return await enterpriseRegistrationSpecimen.update(
      {
        trademark,
        developmentTool,
        securityClassification,
        email,
        unit,
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
   * 设置样品文档集的状态
   */
  setSpecimenStatus: async ({
    registrationUuid,
    status,
    failText,
    statusText
  }) => {
    return await enterpriseRegistrationSpecimen.update(
      { status, failText, statusText },
      {
        where: { uuid: registrationUuid }
      }
    );
  }
};
