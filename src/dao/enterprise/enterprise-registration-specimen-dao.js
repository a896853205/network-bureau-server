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
  selectRegistrationSpecimenByRegistrationUuid: ({
    registrationUuid,
    transaction
  }) =>
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
      where: { uuid: registrationUuid },
      transaction
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
    failText,
    managerStatus,
    failManagerText,
    transaction
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
        failText,
        managerStatus,
        failManagerText
      },
      {
        where: { uuid: registrationUuid },
        raw: true,
        transaction
      }
    ),

  /**
   * 设置样品文档集的状态
   */
  updateSpecimenStatus: ({
    registrationUuid,
    status,
    failText,
    statusText,
    transaction
  }) =>
    enterpriseRegistrationSpecimen.update(
      { status, failText, statusText },
      {
        where: { uuid: registrationUuid },
        transaction
      }
    ),

  /**
   * 设置样品文档集的状态和审核不通过理由
   */
  updateSpecimenManagerStatus: ({
    registrationUuid,
    failManagerText,
    techManagerDate,
    projectManagerDate,
    projectManagerUuid,
    managerStatus,
    transaction
  }) =>
    enterpriseRegistrationSpecimen.update(
      {
        failManagerText,
        managerStatus,
        techManagerDate,
        projectManagerDate,
        projectManagerUuid
      },
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
    transaction
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
    ),

  /**
   * 查询样品登记表信息
   */
  selectRegistrationTestSpecimen: ({ registrationUuid, transaction }) =>
    enterpriseRegistrationSpecimen.findOne({
      attributes: [
        'trademark',
        'developmentTool',
        'securityClassification',
        'email',
        'unit',
        'failManagerText',
        'managerStatus'
      ],
      raw: true,
      where: { uuid: registrationUuid },
      transaction
    }),

  /**
   * 查询样品登记表管理员审核状态
   */
  selectRegistrationSpecimenManagerStatus: ({
    registrationUuid,
    transaction
  }) =>
    enterpriseRegistrationSpecimen.findOne({
      attributes: ['managerStatus'],
      raw: true,
      where: { uuid: registrationUuid },
      transaction
    })
};
