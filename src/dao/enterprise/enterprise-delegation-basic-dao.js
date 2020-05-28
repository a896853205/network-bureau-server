import enterpriseDelegationBasic from '../../db/models/enterprise-delegation-basic';

export default {
  /**
   * 新增基本信息
   */
  insertDelegationBasic: ({ uuid, transaction = null }) =>
    enterpriseDelegationBasic.create(
      {
        uuid,
        status: 0,
        statusText: '未填写'
      },
      { transaction }
    ),
  /**
   * 查询的登记测试的基本信息
   */
  selectDelegationBasicByDelegationUuid: ({
    delegationUuid,
    transaction
  }) =>
    enterpriseDelegationBasic.findOne({
      attributes: [
        'version',
        'linkman',
        'client',
        'phone',
        'address',
        'enterpriseName',
        'devStartTime',
        'failText',
        'status',
        'statusText'
      ],
      raw: true,
      where: { uuid: delegationUuid },
      transaction
    }),

  /**
   * 保存登记测试的基本信息
   */
  updateDelegationBasic: ({
    delegationUuid,
    version,
    linkman,
    client,
    phone,
    address,
    devStartTime,
    enterpriseName,
    status,
    statusText,
    failText,
    transaction
  }) =>
    enterpriseDelegationBasic.update(
      {
        version,
        linkman,
        client,
        phone,
        address,
        devStartTime,
        enterpriseName,
        status,
        statusText,
        failText
      },
      {
        where: { uuid: delegationUuid },
        raw: true,
        transaction
      }
    ),

  /**
   * 查询的登记测试的状态信息
   */
  selectDelegationBasicStatusByDelegationUuid: ({
    delegationUuid,
    transaction
  }) =>
    enterpriseDelegationBasic.findOne({
      attributes: ['status',],
      raw: true,
      where: { uuid: delegationUuid },
      transaction
    }),

  /**
   * 设置基本信息的状态
   */
  updateDelegationBasicStatus: ({
    delegationUuid,
    status,
    failText,
    statusText,
    transaction
  }) =>
    enterpriseDelegationBasic.update(
      { status, failText, statusText },
      {
        where: { uuid: delegationUuid },
        transaction
      }
    )
};
