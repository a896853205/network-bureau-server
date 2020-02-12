import enterpriseRegistrationContract from '../../db/models/enterprise-registration-contract';

export default {
  /**
   * 增加评测合同信息
   */
  insertRegistrationContract: ({ uuid, transaction = null }) => {
    return enterpriseRegistrationContract.create(
      {
        uuid,
        status: 0,
        statusText: '未填写'
      },
      { transaction }
    );
  },

  /**
   * 查询的评测合同信息
   */
  selectRegistrationContractByRegistrationUuid: async registrationUuid => {
    return await enterpriseRegistrationContract.findOne({
      attributes: [
        'amount',
        'fax',
        'postalCode',
        'mainFunction',
        'techIndex',
        'failText',
        'status',
        'statusText'
      ],
      raw: true,
      where: { uuid: registrationUuid }
    });
  },

  /**
   * 保存评测合同的基本信息
   */
  updateRegistrationContract: async ({
    registrationUuid,
    amount,
    fax,
    postalCode,
    mainFunction,
    techIndex,
    status,
    statusText,
    failText
  }) => {
    return await enterpriseRegistrationContract.update(
      {
        amount,
        fax,
        postalCode,
        mainFunction,
        techIndex,
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
   * 设置评测合同的状态
   */
  updateContractStatus: async ({
    registrationUuid,
    status,
    failText,
    statusText
  }) => {
    return await enterpriseRegistrationContract.update(
      { status, failText, statusText },
      {
        where: { uuid: registrationUuid }
      }
    );
  },

  /**
   * 查询的评测合同的基本信息
   */
  selectRegistrationContractManager: async registrationUuid => {
    return await enterpriseRegistrationContract.findOne({
      attributes: [
        'contractCode',
        'specimenHaveTime',
        'payment',
        'paymentTime',
        'contractTime',
        'managerStatus',
        'failText',
        'managerUrl',
        'enterpriseUrl'
      ],
      raw: true,
      where: { uuid: registrationUuid }
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
  }) => {
    return enterpriseRegistrationContract.update(
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
    );
  },

  /**
   * 查询的评测合同的两个url
   */
  selectContractUrl: async registrationUuid => {
    return await enterpriseRegistrationContract.findOne({
      attributes: ['managerUrl', 'enterpriseUrl'],
      raw: true,
      where: { uuid: registrationUuid }
    });
  },

  /**
   * 保存评测合同的甲方基本信息
   */
  updateManagerContractUrl: ({ registrationUuid, managerUrl, transaction }) => {
    return enterpriseRegistrationContract.update(
      {
        managerUrl
      },
      {
        where: { uuid: registrationUuid },
        raw: true,
        transaction
      }
    );
  },

  /**
   * 保存评测合同的乙方基本信息
   */
  updateEnterpriseContractUrl: ({
    registrationUuid,
    enterpriseUrl,
    managerFailText,
    transaction = null
  }) => {
    return enterpriseRegistrationContract.update(
      {
        enterpriseUrl,
        managerFailText
      },
      {
        where: { uuid: registrationUuid },
        raw: true,
        transaction
      }
    );
  },

  /**
   * 设置第二步合同签署步骤
   */
  updateContractManagerStatus: async ({
    registrationUuid,
    managerStatus,
    managerFailText
  }) => {
    return await enterpriseRegistrationContract.update(
      { managerStatus, managerFailText },
      {
        where: { uuid: registrationUuid }
      }
    );
  },

  /**
   * 查询合同的状态值和错误文字
   */
  selectContractManagerStatus: async ({ registrationUuid }) => {
    return await enterpriseRegistrationContract.findOne({
      attributes: ['managerStatus', 'managerFailText'],
      raw: true,
      where: { uuid: registrationUuid }
    });
  }
};
