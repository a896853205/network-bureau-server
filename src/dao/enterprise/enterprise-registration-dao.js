import enterpriseUser from '../../db/models/enterprise-user';
import enterpriseRegistrationApply from '../../db/models/enterprise-registration-apply';
import enterpriseRegistrationContract from '../../db/models/enterprise-registration-contract';
import enterpriseRegistrationCopyright from '../../db/models/enterprise-registration-copyright';
import enterpriseRegistrationDocument from '../../db/models/enterprise-registration-document';
import enterpriseRegistrationProductDescription from '../../db/models/enterprise-registration-product-description';
import enterpriseRegistrationProduct from '../../db/models/enterprise-registration-product';
import enterpriseRegistrationSpecimen from '../../db/models/enterprise-registration-specimen';
import enterpriseRegistration from '../../db/models/enterprise-registration';
import enterpriseRegistrationStep from '../../db/models/enterprise-registration-step';
import enterpriseRegistrationBasic from '../../db/models/enterprise-registration-basic';

import { REGISTRATION_PAGE_SIZE } from '../../config/system-config';

export default {
  /**
   * 通过name查询登记注册
   */
  selectEnterpriseRegistrationByName: name => {
    return enterpriseRegistration.findOne({
      where: { name }
    });
  },

  /**
   * 通过RegistrationUuid查询
   */
  selectRegistrationByRegistrationUuid: registrationUuid => {
    return enterpriseRegistration.findOne({
      where: { uuid: registrationUuid },
      attributes: ['uuid', 'currentStep', 'name'],
      raw: true
    });
  },

  /**
   * 创建一个登记注册
   */
  insertEnterpriseRegistration: ({
    uuid,
    name,
    enterpriseUuid,
    transaction = null
  }) => {
    return enterpriseRegistration.create(
      {
        name,
        currentStep: 1,
        uuid,
        enterpriseUuid
      },
      { transaction }
    );
  },

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
   * 查询企业用户登记测试七个状态通过uuid
   */
  selectRegistrationStatusByRegistrationUuid: async uuid => {
    const [
      enterpriseRegistrationBasicStatus,
      enterpriseRegistrationContractStatus,
      enterpriseRegistrationCopyrightStatus,
      enterpriseRegistrationSpecimenStatus,
      enterpriseRegistrationProductDescriptionStatus,
      enterpriseRegistrationDocumentStatus,
      enterpriseRegistrationProductStatus,
      enterpriseRegistrationApplyStatus
    ] = await Promise.all([
      // 登记测试基本信息
      enterpriseRegistrationBasic.findOne({
        where: { uuid },
        attributes: ['uuid', 'status', 'statusText'],
        raw: true
      }),
      // 评测合同
      enterpriseRegistrationContract.findOne({
        where: { uuid },
        attributes: ['uuid', 'status', 'statusText'],
        raw: true
      }),
      // 软件著作权证书表
      enterpriseRegistrationCopyright.findOne({
        where: { uuid },
        attributes: ['uuid', 'status', 'statusText'],
        raw: true
      }),
      // 样品登记表
      enterpriseRegistrationSpecimen.findOne({
        where: { uuid },
        attributes: ['uuid', 'status', 'statusText'],
        raw: true
      }),
      // 产品说明表
      enterpriseRegistrationProductDescription.findOne({
        where: { uuid },
        attributes: ['uuid', 'status', 'statusText'],
        raw: true
      }),
      // 用户文档表
      enterpriseRegistrationDocument.findOne({
        where: { uuid },
        attributes: ['uuid', 'status', 'statusText'],
        raw: true
      }),
      // 产品介质表
      enterpriseRegistrationProduct.findOne({
        where: { uuid },
        attributes: ['uuid', 'status', 'statusText'],
        raw: true
      }),
      // 现场测试申请表
      enterpriseRegistrationApply.findOne({
        where: { uuid },
        attributes: ['uuid', 'status', 'statusText'],
        raw: true
      })
    ]);

    return {
      enterpriseRegistrationBasicStatus,
      enterpriseRegistrationContractStatus,
      enterpriseRegistrationCopyrightStatus,
      enterpriseRegistrationSpecimenStatus,
      enterpriseRegistrationProductDescriptionStatus,
      enterpriseRegistrationDocumentStatus,
      enterpriseRegistrationProductStatus,
      enterpriseRegistrationApplyStatus
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
  updateRegistrationCurrentStep: ({ registrationUuid, currentStep }) => {
    return enterpriseRegistration.update(
      {
        currentStep
      },
      {
        where: {
          uuid: registrationUuid
        }
      }
    );
  },

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
  }
};
