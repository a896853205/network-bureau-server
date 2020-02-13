import enterpriseRegistrationSpecimen from '../../db/models/enterprise-registration-specimen';

export default {
  /**
   * 增加样品登记表信息
   */
  insertRegistrationSpecimen: ({ uuid, transaction = null }) => {
    return enterpriseRegistrationSpecimen.create(
      {
        uuid,
        status: 0,
        statusText: '未填写'
      },
      { transaction }
    );
  },
  /**
   * 查询的样品登记表信息
   */
  selectRegistrationSpecimenByRegistrationUuid: registrationUuid => {
    return enterpriseRegistrationSpecimen.findOne({
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
   * 保存样品登记表信息
   */
  updateRegistrationSpecimen: ({
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
    return enterpriseRegistrationSpecimen.update(
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
  updateSpecimenStatus: ({
    registrationUuid,
    status,
    failText,
    statusText
  }) => {
    return enterpriseRegistrationSpecimen.update(
      { status, failText, statusText },
      {
        where: { uuid: registrationUuid }
      }
    );
  }
};
