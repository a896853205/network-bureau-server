import enterpriseUser from '../../db/models/enterprise-user';
import enterpriseDelegationContract from '../../db/models/enterprise-delegation-contract';
import enterpriseDelegation from '../../db/models/enterprise-delegation';
import enterpriseDelegationStep from '../../db/models/enterprise-delegation-step';
import enterpriseDelegationBasic from '../../db/models/enterprise-delegation-basic';
import enterpriseDelegationSpecimen from '../../db/models/enterprise-delegation-specimen';
import enterpriseDelegationApply from '../../db/models/enterprise-delegation-apply';

import Sequelize from 'sequelize';
const { or } = Sequelize.Op;

import { REGISTRATION_PAGE_SIZE } from '../../config/system-config';

export default {
  /**
   * 通过name查询登记测试
   */
  selectEnterpriseDelegationByName: ({ name, transaction = null }) =>
    enterpriseDelegation.findOne({
      where: { name },
      transaction
    }),

  /**
   * 通过DelegationUuid查询
   */
  selectDelegationCurrentStepByDelegationUuid: ({ delegationUuid, transaction }) =>
    enterpriseDelegation.findOne({
      where: { uuid: delegationUuid },
      attributes: ['currentStep'],
      raw: true,
      transaction
    }),

  /**
   * 通过DelegationUuid查询
   */
  selectDelegationByDelegationUuid: ({ delegationUuid, transaction }) =>
    enterpriseDelegation.findOne({
      where: { uuid: delegationUuid },
      attributes: [
        'uuid',
        'currentStep',
        'name',
        'projectManagerUuid',
        'techLeaderManagerUuid',
        'techManagerUuid',
        'certifierManagerUuid',
        'accountantManagerUuid'
      ],
      raw: true,
      transaction
    }),

  /**
   * 创建一个登记注册
   */
  insertEnterpriseDelegation: ({
    uuid,
    name,
    enterpriseUuid,
    transaction = null
  }) =>
    enterpriseDelegation.create(
      {
        name,
        currentStep: 1,
        uuid,
        enterpriseUuid
      },
      { transaction }
    ),

  /**
   * 查询企业用户登记测试
   */
  queryDelegationByEnterpriseUuid: async (enterpriseUuid, page) => {
    const result = await enterpriseDelegation.findAndCountAll({
      where: { enterpriseUuid },
      attributes: ['uuid', 'enterpriseUuid', 'name', 'currentStep'],
      limit: REGISTRATION_PAGE_SIZE,
      offset: (page - 1) * REGISTRATION_PAGE_SIZE,
      raw: true
    });

    return {
      enterpriseDelegationList: result.rows,
      total: result.count,
      pageSize: REGISTRATION_PAGE_SIZE
    };
  },

  /**
   * 查询企业用户登记测试
   */
  queryDelegation: async page => {
    const result = await enterpriseDelegation.findAndCountAll({
      attributes: ['uuid', 'enterpriseUuid', 'name', 'currentStep'],
      limit: REGISTRATION_PAGE_SIZE,
      offset: (page - 1) * REGISTRATION_PAGE_SIZE,
      raw: true,
      include: [
        {
          model: enterpriseUser,
          attributes: ['name', 'phone'],
          as: 'enterpriseUser'
        }
      ]
    });

    return {
      enterpriseDelegationList: result.rows,
      total: result.count,
      pageSize: REGISTRATION_PAGE_SIZE
    };
  },

  /**
   * 更新登记测试的步骤
   */
  updateDelegationCurrentStep: ({
    delegationUuid,
    currentStep,
    transaction = null
  }) =>
    enterpriseDelegation.update(
      {
        currentStep
      },
      {
        where: {
          uuid: delegationUuid
        },
        transaction
      }
    ),

  /**
   * 查询企业的缴费信息
   */
  queryDelegationPayment: async ({ page, uuidList }) => {
    const result = await enterpriseDelegation.findAndCountAll({
      attributes: ['uuid'],
      limit: REGISTRATION_PAGE_SIZE,
      offset: (page - 1) * REGISTRATION_PAGE_SIZE,
      raw: true,
      where: { uuid: uuidList },
      include: [
        {
          model: enterpriseDelegationBasic,
          attributes: ['enterpriseName', 'phone'],
          as: 'enterpriseDelegationBasic'
        },
        {
          model: enterpriseDelegationContract,
          attributes: ['contractCode'],
          as: 'enterpriseDelegationContract'
        },
        {
          model: enterpriseDelegationStep,
          attributes: ['statusText', 'status'],
          where: { step: 3 },
          as: 'enterpriseDelegationStep'
        }
      ]
    });

    return {
      paymentList: result.rows,
      total: result.count,
      pageSize: REGISTRATION_PAGE_SIZE
    };
  },

  /**
   *查询待分配技术负责人员的企业登记测试列表
   */
  queryDelegationNeedAssigned: async ({ page, uuidList }) => {
    const result = await enterpriseDelegation.findAndCountAll({
      attributes: ['uuid'],
      limit: REGISTRATION_PAGE_SIZE,
      offset: (page - 1) * REGISTRATION_PAGE_SIZE,
      raw: true,
      where: { uuid: uuidList },
      include: [
        {
          model: enterpriseDelegationBasic,
          attributes: ['enterpriseName', 'phone'],
          as: 'enterpriseDelegationBasic'
        },
        {
          model: enterpriseDelegationContract,
          attributes: ['contractCode'],
          as: 'enterpriseDelegationContract'
        },
        {
          model: enterpriseDelegationStep,
          attributes: ['statusText', 'status'],
          where: { step: 4 },
          as: 'enterpriseDelegationStep'
        }
      ]
    });
    return {
      enterpriseDelegationList: result.rows,
      total: result.count,
      pageSize: REGISTRATION_PAGE_SIZE
    };
  },

  /**
   *查询待分配技术负责人员的企业登记测试列表
   */
  quaryDelegationNeedFieldTest: async ({ page, managerUuid }) => {
    const result = await enterpriseDelegation.findAndCountAll({
      attributes: ['uuid'],
      limit: REGISTRATION_PAGE_SIZE,
      offset: (page - 1) * REGISTRATION_PAGE_SIZE,
      raw: true,
      where: { techManagerUuid: managerUuid },
      include: [
        {
          model: enterpriseDelegationBasic,
          attributes: ['enterpriseName', 'phone'],
          as: 'enterpriseDelegationBasic'
        },
        {
          model: enterpriseDelegationContract,
          attributes: ['contractCode'],
          as: 'enterpriseDelegationContract'
        },
        {
          model: enterpriseDelegationStep,
          attributes: ['statusText', 'status'],
          where: { step: 4 },
          as: 'enterpriseDelegationStep'
        },
        {
          model: enterpriseDelegationSpecimen,
          attributes: ['managerStatus'],
          as: 'enterpriseDelegationSpecimen'
        },
        {
          model: enterpriseDelegationApply,
          attributes: ['managerStatus'],
          as: 'enterpriseDelegationApply'
        }
      ]
    });

    return {
      enterpriseDelegationList: result.rows,
      total: result.count,
      pageSize: REGISTRATION_PAGE_SIZE
    };
  },

  /**
   * 更新负责的财务人员
   */
  updateDelegationAccountantUuid: ({
    delegationUuid,
    accountantManagerUuid,
    transaction = null
  }) =>
    enterpriseDelegation.update(
      {
        accountantManagerUuid
      },
      {
        where: {
          uuid: delegationUuid
        },
        transaction
      }
    ),

  /**
   * 更新负责的技术负责人
   */
  updateDelegationTechLeaderUuid: ({
    delegationUuid,
    techLeaderManagerUuid,
    transaction = null
  }) =>
    enterpriseDelegation.update(
      {
        techLeaderManagerUuid
      },
      {
        where: {
          uuid: delegationUuid
        },
        transaction
      }
    ),

  /**
   * 更新负责的项目管理员人员
   */
  updateDelegationProjectManagerUuid: ({
    delegationUuid,
    projectManagerUuid,
    transaction = null
  }) =>
    enterpriseDelegation.update(
      {
        projectManagerUuid
      },
      {
        where: {
          uuid: delegationUuid
        },
        transaction
      }
    ),

  /**
   * 更新负责的技术人员
   */
  updateDelegationTechManagerUuid: ({
    delegationUuid,
    techManagerUuid,
    transaction = null
  }) =>
    enterpriseDelegation.update(
      {
        techManagerUuid
      },
      {
        where: {
          uuid: delegationUuid
        },
        transaction
      }
    ),

  /**
   * 更新负责的批准人
   */
  updateDelegationCertifierManagerUuid: ({
    delegationUuid,
    certifierManagerUuid,
    transaction = null
  }) =>
    enterpriseDelegation.update(
      {
        certifierManagerUuid
      },
      {
        where: {
          uuid: delegationUuid
        },
        transaction
      }
    ),

  /**
   * 查询登记测试企业信息(文件审核页面)
   */
  selectEnterpriseInfoByDelegationUuid: delegationUuid =>
    enterpriseDelegation.findOne({
      where: { uuid: delegationUuid },
      attributes: ['enterpriseUuid'],
      raw: true
    }),
  /**
   * 查询登记测试财技术人员的uuid
   */
  selectDelegationTechManagerUuid: delegationUuid =>
    enterpriseDelegation.findOne({
      where: { uuid: delegationUuid },
      attributes: ['techManagerUuid'],
      raw: true
    }),

  /**
   * 查询登记测试财务管理员的uuid
   */
  selectDelegationAccoutantManagerUuid: delegationUuid =>
    enterpriseDelegation.findOne({
      where: { uuid: delegationUuid },
      attributes: ['accountantManagerUuid'],
      raw: true
    }),

  /**
   * 查询登记测试技术负责人的uuid
   */
  selectDelegationTechLeaderManagerUuid: delegationUuid =>
    enterpriseDelegation.findOne({
      where: { uuid: delegationUuid },
      attributes: ['techLeaderManagerUuid'],
      raw: true
    }),

  /**
   *查询待分配批准人的企业登记测试列表
   */
  quaryDelegationNeedCertified: async ({
    page,
    uuidList,
    certifierManagerUuid
  }) => {
    const result = await enterpriseDelegation.findAndCountAll({
      attributes: ['uuid'],
      limit: REGISTRATION_PAGE_SIZE,
      offset: (page - 1) * REGISTRATION_PAGE_SIZE,
      raw: true,
      where: {
        uuid: uuidList,
        [or]: [{ certifierManagerUuid }, { certifierManagerUuid: null }]
      },
      include: [
        {
          model: enterpriseDelegationBasic,
          attributes: ['enterpriseName', 'phone'],
          as: 'enterpriseDelegationBasic'
        },
        {
          model: enterpriseDelegationContract,
          attributes: ['contractCode'],
          as: 'enterpriseDelegationContract'
        },
        {
          model: enterpriseDelegationStep,
          attributes: ['statusText', 'status'],
          where: { step: 4 },
          as: 'enterpriseDelegationStep'
        },
        {
          model: enterpriseDelegationApply,
          attributes: ['managerStatus'],
          as: 'enterpriseDelegationApply'
        }
      ]
    });

    return {
      enterpriseDelegationList: result.rows,
      total: result.count,
      pageSize: REGISTRATION_PAGE_SIZE
    };
  }
};
