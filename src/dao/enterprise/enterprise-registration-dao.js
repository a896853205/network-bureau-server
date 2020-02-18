import enterpriseUser from '../../db/models/enterprise-user';
import enterpriseRegistrationContract from '../../db/models/enterprise-registration-contract';
import enterpriseRegistration from '../../db/models/enterprise-registration';
import enterpriseRegistrationStep from '../../db/models/enterprise-registration-step';
import enterpriseRegistrationBasic from '../../db/models/enterprise-registration-basic';

import { REGISTRATION_PAGE_SIZE } from '../../config/system-config';

export default {
  /**
   * 通过name查询登记测试
   */
  selectEnterpriseRegistrationByName: name =>
    enterpriseRegistration.findOne({
      where: { name }
    }),

  /**
   * 通过RegistrationUuid查询
   */
  selectRegistrationByRegistrationUuid: registrationUuid =>
    enterpriseRegistration.findOne({
      where: { uuid: registrationUuid },
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
      raw: true
    }),

  /**
   * 创建一个登记注册
   */
  insertEnterpriseRegistration: ({
    uuid,
    name,
    enterpriseUuid,
    transaction = null
  }) =>
    enterpriseRegistration.create(
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
  queryRegistrationByEnterpriseUuid: async (enterpriseUuid, page) => {
    const result = await enterpriseRegistration.findAndCountAll({
      where: { enterpriseUuid },
      attributes: ['uuid', 'enterpriseUuid', 'name', 'currentStep'],
      limit: REGISTRATION_PAGE_SIZE,
      offset: (page - 1) * REGISTRATION_PAGE_SIZE,
      raw: true
    });

    return {
      enterpriseRegistrationList: result.rows,
      total: result.count,
      pageSize: REGISTRATION_PAGE_SIZE
    };
  },

  /**
   * 查询企业用户登记测试
   */
  queryRegistration: async page => {
    const result = await enterpriseRegistration.findAndCountAll({
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
      enterpriseRegistrationList: result.rows,
      total: result.count,
      pageSize: REGISTRATION_PAGE_SIZE
    };
  },

  /**
   * 更新登记测试的步骤
   */
  updateRegistrationCurrentStep: ({ registrationUuid, currentStep }) =>
    enterpriseRegistration.update(
      {
        currentStep
      },
      {
        where: {
          uuid: registrationUuid
        }
      }
    ),

  /**
   * 查询企业的缴费信息
   */
  queryRegistrationPayment: async ({ page, uuidList }) => {
    const result = await enterpriseRegistration.findAndCountAll({
      attributes: ['uuid'],
      limit: REGISTRATION_PAGE_SIZE,
      offset: (page - 1) * REGISTRATION_PAGE_SIZE,
      raw: true,
      where: { uuid: uuidList },
      include: [
        {
          model: enterpriseRegistrationBasic,
          attributes: ['enterpriseName', 'phone'],
          as: 'enterpriseRegistrationBasic'
        },
        {
          model: enterpriseRegistrationContract,
          attributes: ['contractCode'],
          as: 'enterpriseRegistrationContract'
        },
        {
          model: enterpriseRegistrationStep,
          attributes: ['statusText', 'status'],
          where: { step: 3 },
          as: 'enterpriseRegistrationStep'
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
  queryRegistrationNeedAssigned: async ({ page, uuidList }) => {
    const result = await enterpriseRegistration.findAndCountAll({
      attributes: ['uuid'],
      limit: REGISTRATION_PAGE_SIZE,
      offset: (page - 1) * REGISTRATION_PAGE_SIZE,
      raw: true,
      where: { uuid: uuidList },
      include: [
        {
          model: enterpriseRegistrationBasic,
          attributes: ['enterpriseName', 'phone'],
          as: 'enterpriseRegistrationBasic'
        },
        {
          model: enterpriseRegistrationContract,
          attributes: ['contractCode'],
          as: 'enterpriseRegistrationContract'
        },
        {
          model: enterpriseRegistrationStep,
          attributes: ['statusText', 'status'],
          where: { step: 4 },
          as: 'enterpriseRegistrationStep'
        }
      ]
    });
    return {
      enterpriseRegistrationList: result.rows,
      total: result.count,
      pageSize: REGISTRATION_PAGE_SIZE
    };
  },

  /**
   *查询待分配技术负责人员的企业登记测试列表
   */
  quaryRegistratiomNeedFieldTest: async ({ page, managerUuid }) => {
    const result = await enterpriseRegistration.findAndCountAll({
      attributes: ['uuid'],
      limit: REGISTRATION_PAGE_SIZE,
      offset: (page - 1) * REGISTRATION_PAGE_SIZE,
      raw: true,
      where: { techManagerUuid: managerUuid },
      include: [
        {
          model: enterpriseRegistrationBasic,
          attributes: ['enterpriseName', 'phone'],
          as: 'enterpriseRegistrationBasic'
        },
        {
          model: enterpriseRegistrationContract,
          attributes: ['contractCode'],
          as: 'enterpriseRegistrationContract'
        },
        {
          model: enterpriseRegistrationStep,
          attributes: ['statusText', 'status'],
          where: { step: 4 },
          as: 'enterpriseRegistrationStep'
        }
      ]
    });

    return {
      enterpriseRegistrationList: result.rows,
      total: result.count,
      pageSize: REGISTRATION_PAGE_SIZE
    };
  },

  /**
   * 更新负责的财务人员
   */
  updateRegistrationAccountantUuid: ({
    registrationUuid,
    accountantManagerUuid,
    transaction = null
  }) =>
    enterpriseRegistration.update(
      {
        accountantManagerUuid
      },
      {
        where: {
          uuid: registrationUuid
        },
        transaction
      }
    ),

  /**
   * 更新负责的技术负责人
   */
  updateRegistrationTechLeaderUuid: ({
    registrationUuid,
    techLeaderManagerUuid,
    transaction = null
  }) =>
    enterpriseRegistration.update(
      {
        techLeaderManagerUuid
      },
      {
        where: {
          uuid: registrationUuid
        },
        transaction
      }
    ),

  /**
   * 更新负责的项目管理员人员
   */
  updateRegistrationProjectManagerUuid: ({
    registrationUuid,
    projectManagerUuid,
    transaction = null
  }) =>
    enterpriseRegistration.update(
      {
        projectManagerUuid
      },
      {
        where: {
          uuid: registrationUuid
        },
        transaction
      }
    ),

  /**
   * 更新负责的技术人员
   */
  updateRegistrationTechManagerUuid: ({
    registrationUuid,
    techManagerUuid,
    transaction = null
  }) =>
    enterpriseRegistration.update(
      {
        techManagerUuid
      },
      {
        where: {
          uuid: registrationUuid
        },
        transaction
      }
    ),

  /**
   * 查询登记测试企业信息(文件审核页面)
   */
  selectEnterpriseInfoByRegistrationUuid: registrationUuid =>{
    enterpriseRegistration.findOne({
      where: { uuid: registrationUuid },
      attributes: ['enterpriseUuid'],
      raw: true
    }),
    
  /**
   * 查询登记测试财技术人员的uuid
   */
  selectRegistrationTechManagerUuid: registrationUuid => {
    return enterpriseRegistration.findOne({
      where: { uuid: registrationUuid },
      attributes: ['techManagerUuid'],
      raw: true
    });
  },

  /**
   * 查询登记测试财务管理员的uuid
   */
  selectRegistrationAccoutantManagerUuid: registrationUuid => {
    return enterpriseRegistration.findOne({
      where: { uuid: registrationUuid },
      attributes: ['accountantManagerUuid'],
      raw: true
    });
  },

  /**
   * 查询登记测试技术负责人的uuid
   */
  selectRegistrationTechLeaderManagerUuid: registrationUuid => {
    return enterpriseRegistration.findOne({
      where: { uuid: registrationUuid },
      attributes: ['techLeaderManagerUuid'],
      raw: true
    })
    });
  }
};
