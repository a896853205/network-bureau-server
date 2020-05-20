import enterpriseRegistrationContract from '../../db/models/enterprise-registration-contract';

export default {
  /**
   * 增加评测合同信息
   */
  insertRegistrationContract: ({ uuid, transaction = null }) =>
    enterpriseRegistrationContract.create(
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
  selectRegistrationContractByRegistrationUuid: ({
    registrationUuid,
    transaction
  }) =>
    enterpriseRegistrationContract.findOne({
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
      where: { uuid: registrationUuid },
      transaction
    }),

  /**
   * 保存评测合同的基本信息
   */
  updateRegistrationContract: ({
    registrationUuid,
    amount,
    postalCode,
    mainFunction,
    techIndex,
    status,
    statusText,
    failText,
    transaction = null
  }) =>
    enterpriseRegistrationContract.update(
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
        where: { uuid: registrationUuid },
        raw: true,
        transaction
      }
    ),

  /**
   * 设置评测合同的状态
   */
  updateContractStatus: ({
    registrationUuid,
    status,
    failText,
    statusText,
    transaction
  }) =>
    enterpriseRegistrationContract.update(
      { status, failText, statusText },
      {
        where: { uuid: registrationUuid },
        transaction
      }
    ),

  /**
   * 查询是否存在相同合同编号的测试
   */
  selectRegistrationByContractCode: ({ contractCode, transaction = null }) => {
    return enterpriseRegistrationContract.findOne({
      where: { contractCode },
      attributes: ['contractCode', 'uuid'],
      transaction,
      raw: true
    });
  },

  /**
   * 查询的评测合同的基本信息
   */
  selectRegistrationContractManager: ({
    registrationUuid,
    transation = null
  }) => {
    return enterpriseRegistrationContract.findOne({
      attributes: [
        'contractCode',
        'specimenHaveTime',
        'payment',
        'paymentTime',
        'contractTime',
        'failText',
        'managerUrl',
        'enterpriseUrl'
      ],
      raw: true,
      where: { uuid: registrationUuid },
      transation
    });
  },

  /**
   * 保存评测合同的基本信息
   */
  updateRegistrationContractManager: ({
    registrationUuid,
    contractCode,
    specimenHaveTime,
    payment,
    paymentTime,
    contractTime,
    transaction = null
  }) =>
    enterpriseRegistrationContract.update(
      {
        contractCode,
        specimenHaveTime,
        payment,
        paymentTime,
        contractTime
      },
      {
        where: { uuid: registrationUuid },
        raw: true,
        transaction
      }
    ),

  /**
   * 查询的评测合同的两个url
   */
  selectContractUrl: ({ registrationUuid, transaction = null }) =>
    enterpriseRegistrationContract.findOne({
      attributes: ['managerUrl', 'enterpriseUrl'],
      raw: true,
      where: { uuid: registrationUuid },
      transaction
    }),

  /**
   * 保存评测合同的甲方基本信息
   */
  updateManagerContractUrl: ({ registrationUuid, managerUrl, transaction }) =>
    enterpriseRegistrationContract.update(
      {
        managerUrl
      },
      {
        where: { uuid: registrationUuid },
        raw: true,
        transaction
      }
    ),

  /**
   * 保存评测合同的乙方基本信息
   */
  updateEnterpriseContractUrl: ({
    registrationUuid,
    enterpriseUrl,
    managerFailText,
    transaction = null
  }) =>
    enterpriseRegistrationContract.update(
      {
        enterpriseUrl,
        managerFailText
      },
      {
        where: { uuid: registrationUuid },
        raw: true,
        transaction
      }
    ),

  /**
   * 设置第二步合同签署错误状态
   */
  updateContractManagerStatus: ({
    registrationUuid,
    managerFailText,
    transaction = null
  }) =>
    enterpriseRegistrationContract.update(
      { managerFailText },
      {
        where: { uuid: registrationUuid },
        raw: true,
        transaction
      }
    ),

  /**
   * 查询合同的错误文字
   */
  selectContractManagerFailText: registrationUuid =>
    enterpriseRegistrationContract.findOne({
      attributes: ['managerFailText'],
      raw: true,
      where: { uuid: registrationUuid }
    })
};
