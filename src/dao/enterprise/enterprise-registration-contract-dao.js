import enterpriseRegistrationContract from '../../db/models/enterprise-registration-contract';

export default {
  /**
   * 增加评测合同信息
   */
  insertRegistrationContract: async registrationUuid => {
    return await enterpriseRegistrationContract.create({
      uuid: registrationUuid,
      status: 0,
      statusText: '未填写'
    });
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
  updateRegistrationContractManager: async ({
    registrationUuid,
    contractCode,
    specimenHaveTime,
    payment,
    paymentTime,
    contractTime,
    managerStatus
  }) => {
    return await enterpriseRegistrationContract.update(
      {
        contractCode,
        specimenHaveTime,
        payment,
        paymentTime,
        contractTime,
        managerStatus
      },
      {
        where: { uuid: registrationUuid },
        raw: true
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
  updateManagerContractUrl: async ({
    registrationUuid,
    managerUrl,
    managerStatus
  }) => {
    return await enterpriseRegistrationContract.update(
      {
        managerUrl,
        managerStatus
      },
      {
        where: { uuid: registrationUuid },
        raw: true
      }
    );
  },

  /**
   * 保存评测合同的乙方基本信息
   */
  updateEnterpriseContractUrl: async ({
    registrationUuid,
    enterpriseUrl,
    managerStatus,
    failText
  }) => {
    return await enterpriseRegistrationContract.update(
      {
        enterpriseUrl,
        managerStatus,
        failText
      },
      {
        where: { uuid: registrationUuid },
        raw: true
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
