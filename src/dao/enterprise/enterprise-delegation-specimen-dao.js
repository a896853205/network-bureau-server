import enterpriseDelegationSpecimen from '../../db/models/enterprise-delegation-specimen';

export default {
  /**
   * 增加样品登记表信息
   */
  insertDelegationSpecimen: ({ uuid, transaction = null }) =>
    enterpriseDelegationSpecimen.create(
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
  selectDelegationSpecimenByDelegationUuid: ({
    delegationUuid,
    transaction
  }) =>
    enterpriseDelegationSpecimen.findOne({
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
      where: { uuid: delegationUuid },
      transaction
    }),

  /**
   * 查询的登记测试的状态信息
   */
  selectDelegationSpecimenStatusByDelegationUuid: ({
    delegationUuid,
    transaction
  }) =>
    enterpriseDelegationSpecimen.findOne({
      attributes: ['status',],
      raw: true,
      where: { uuid: delegationUuid },
      transaction
    }),

  /**
   * 保存样品登记表信息
   */
  updateDelegationSpecimen: ({
    delegationUuid,
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
    enterpriseDelegationSpecimen.update(
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
        where: { uuid: delegationUuid },
        raw: true,
        transaction
      }
    ),

  /**
   * 设置样品文档集的状态
   */
  updateDelegationSpecimenStatus: ({
    delegationUuid,
    status,
    failText,
    statusText,
    transaction
  }) =>
    enterpriseDelegationSpecimen.update(
      { status, failText, statusText },
      {
        where: { uuid: delegationUuid },
        transaction
      }
    ),

  /**
   * 设置样品文档集的状态和审核不通过理由
   */
  updateDelegationSpecimenManagerStatus: ({
    delegationUuid,
    failManagerText,
    techManagerDate,
    projectManagerDate,
    projectManagerUuid,
    managerStatus,
    transaction
  }) =>
    enterpriseDelegationSpecimen.update(
      {
        failManagerText,
        managerStatus,
        techManagerDate,
        projectManagerDate,
        projectManagerUuid
      },
      {
        where: { uuid: delegationUuid },
        transaction
      }
    ),
  /**
   * 设置样品文档集的管理员uuid
   */
  updateDelegationSpecimenManagerUuid: ({
    delegationUuid,
    projectManagerUuid,
    techManagerUuid,
    transaction
  }) =>
    enterpriseDelegationSpecimen.update(
      {
        projectManagerUuid,
        techManagerUuid
      },
      {
        where: { uuid: delegationUuid },
        transaction
      }
    ),

  /**
   * 查询样品登记表信息
   */
  selectDelegationTestSpecimen: ({ delegationUuid, transaction }) =>
    enterpriseDelegationSpecimen.findOne({
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
      where: { uuid: delegationUuid },
      transaction
    }),

  /**
   * 查询样品登记表管理员审核状态
   */
  selectDelegationSpecimenManagerStatus: ({
    delegationUuid,
    transaction
  }) =>
    enterpriseDelegationSpecimen.findOne({
      attributes: ['managerStatus'],
      raw: true,
      where: { uuid: delegationUuid },
      transaction
    })
};
