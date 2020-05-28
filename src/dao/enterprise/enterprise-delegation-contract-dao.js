import enterpriseDelegationContract from '../../db/models/enterprise-delegation-contract';

export default {
  /**
   * 增加评测合同信息
   */
  insertDelegationContract: ({ uuid, transaction = null }) =>
    enterpriseDelegationContract.create(
      {
        uuid,
        status: 0,
        statusText: '未填写'
      },
      { transaction }
    ),

  /**
   * 查询的评测合同信息
   */
  selectDelegationContractByDelegationUuid: ({
    delegationUuid,
    transaction
  }) =>
    enterpriseDelegationContract.findOne({
      attributes: [
        'amount',
        'postalCode',
        'mainFunction',
        'techIndex',
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
  selectDelegationContractStatusByDelegationUuid: ({
    delegationUuid,
    transaction
  }) =>
    enterpriseDelegationContract.findOne({
      attributes: ['status',],
      raw: true,
      where: { uuid: delegationUuid },
      transaction
    }),

  /**
   * 保存评测合同的基本信息
   */
  updateDelegationContract: ({
    delegationUuid,
    amount,
    postalCode,
    mainFunction,
    techIndex,
    status,
    statusText,
    failText,
    transaction = null
  }) =>
    enterpriseDelegationContract.update(
      {
        amount,
        postalCode,
        mainFunction,
        techIndex,
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
   * 设置评测合同的状态
   */
  updateDelegationContractStatus: ({
    delegationUuid,
    status,
    failText,
    statusText,
    transaction
  }) =>
    enterpriseDelegationContract.update(
      { status, failText, statusText },
      {
        where: { uuid: delegationUuid },
        transaction
      }
    ),

  /**
   * 查询是否存在相同合同编号的测试
   */
  selectDelegationByContractCode: ({ contractCode, transaction = null }) => {
    return enterpriseDelegationContract.findOne({
      where: { contractCode },
      attributes: ['contractCode', 'uuid'],
      transaction,
      raw: true
    });
  },

  /**
   * 查询的评测合同的基本信息
   */
  selectDelegationContractManager: ({
    delegationUuid,
    transation = null
  }) => {
    return enterpriseDelegationContract.findOne({
      attributes: [
        'contractCode',
        'specimenHaveTime',
        'payment',
        'contractTime',
        'failText',
        'managerUrl',
        'enterpriseUrl'
      ],
      raw: true,
      where: { uuid: delegationUuid },
      transation
    });
  },

  /**
   * 保存评测合同的基本信息
   */
  updateDelegationContractManager: ({
    delegationUuid,
    contractCode,
    specimenHaveTime,
    payment,
    contractTime,
    transaction = null
  }) =>
    enterpriseDelegationContract.update(
      {
        contractCode,
        specimenHaveTime,
        payment,
        contractTime
      },
      {
        where: { uuid: delegationUuid },
        raw: true,
        transaction
      }
    ),

  /**
   * 查询的评测合同的两个url
   */
  selectDelegationContractUrl: ({ delegationUuid, transaction = null }) =>
    enterpriseDelegationContract.findOne({
      attributes: ['managerUrl', 'enterpriseUrl'],
      raw: true,
      where: { uuid: delegationUuid },
      transaction
    }),

  /**
   * 保存评测合同的甲方基本信息
   */
  updateDelegationManagerContractUrl: ({ delegationUuid, managerUrl, transaction }) =>
    enterpriseDelegationContract.update(
      {
        managerUrl
      },
      {
        where: { uuid: delegationUuid },
        raw: true,
        transaction
      }
    ),

  /**
   * 保存评测合同的乙方基本信息
   */
  updateDelegationEnterpriseContractUrl: ({
    delegationUuid,
    enterpriseUrl,
    managerFailText,
    transaction = null
  }) =>
    enterpriseDelegationContract.update(
      {
        enterpriseUrl,
        managerFailText
      },
      {
        where: { uuid: delegationUuid },
        raw: true,
        transaction
      }
    ),

  /**
   * 设置第二步合同签署错误状态
   */
  updateDelegationContractManagerStatus: ({
    delegationUuid,
    managerFailText,
    transaction = null
  }) =>
    enterpriseDelegationContract.update(
      { managerFailText },
      {
        where: { uuid: delegationUuid },
        raw: true,
        transaction
      }
    ),

  /**
   * 查询合同的错误文字
   */
  selectDelegationContractManagerFailText: delegationUuid =>
    enterpriseDelegationContract.findOne({
      attributes: ['managerFailText'],
      raw: true,
      where: { uuid: delegationUuid }
    })
};
