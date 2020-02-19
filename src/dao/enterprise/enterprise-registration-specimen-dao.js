import enterpriseRegistrationSpecimen from '../../db/models/enterprise-registration-specimen';

export default {
  /**
   * 增加样品登记表信息
   */
  insertRegistrationSpecimen: ({ uuid, transaction = null }) =>
    enterpriseRegistrationSpecimen.create(
      {
        uuid,
        status: 0,
        statusText: '未填写'
      },
      { transaction }
    ),
  /**
   * 查询的样品登记表信息
   */
  selectRegistrationSpecimenByRegistrationUuid: registrationUuid =>
    enterpriseRegistrationSpecimen.findOne({
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
    }),

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
  }) =>
    enterpriseRegistrationSpecimen.update(
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
    ),

  /**
   * 设置样品文档集的状态
   */
  updateSpecimenStatus: ({ registrationUuid, status, failText, statusText }) =>
    enterpriseRegistrationSpecimen.update(
      { status, failText, statusText },
      {
        where: { uuid: registrationUuid }
      }
    ),
  /**
   * 设置样品文档集的管理员状态
   */
  updateSpecimenManagerStatus: ({
    registrationUuid,
    managerStatus,
    transaction = null
  }) =>
    enterpriseRegistrationSpecimen.update(
      { managerStatus },
      {
        where: { uuid: registrationUuid },
        transaction
      }
    ),
  /**
   * 设置样品文档集的管理员uuid
   */
  updateSpecimenManagerUuid: ({
    registrationUuid,
    projectManagerUuid,
    techManagerUuid,
    transaction = null
  }) =>
    enterpriseRegistrationSpecimen.update(
      {
        projectManagerUuid,
        techManagerUuid
      },
      {
        where: { uuid: registrationUuid },
        transaction
      }
    )
};
