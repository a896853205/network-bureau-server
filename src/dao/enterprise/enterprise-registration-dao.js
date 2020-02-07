import { db } from '../../db/db-connect';

import enterpriseUser from '../../db/models/enterprise-user';
import enterpriseRegistrationApply from '../../db/models/enterprise-registration-apply';
import enterpriseRegistrationContract from '../../db/models/enterprise-registration-contract';
import enterpriseRegistrationCopyright from '../../db/models/enterprise-registration-copyright';
import enterpriseRegistrationDocument from '../../db/models/enterprise-registration-document';
import enterpriseRegistrationProductDescription from '../../db/models/enterprise-registration-product-description';
import enterpriseRegistrationProduct from '../../db/models/enterprise-registration-product';
import enterpriseRegistrationSpecimen from '../../db/models/enterprise-registration-specimen';
import enterpriseRegistration from '../../db/models/enterprise-registration';
import sysRegistrationStep from '../../db/models/sys-registration-step';
import enterpriseRegistrationStep from '../../db/models/enterprise-registration-step';
import enterpriseRegistrationBasic from '../../db/models/enterprise-registration-basic';

import { REGISTRATION_PAGE_SIZE } from '../../config/system-config';

import uuid from 'uuid';

export default {
  /**
   * 通过name查询登记注册
   */
  selectEnterpriseRegistrationByName: async name => {
    return await enterpriseRegistration.findOne({
      where: { name }
    });
  },

  /**
   * 通过RegistrationUuid查询
   */
  selectRegistrationByRegistrationUuid: async registrationUuid => {
    return await enterpriseRegistration.findOne({
      where: { uuid: registrationUuid },
      attributes: ['uuid', 'currentStep', 'name'],
      raw: true
    });
  },

  /**
   * 创建一个登记注册
   */
  createEnterpriseRegistration: async (
    name,
    enterpriseUuid,
    managerProjectUuid
  ) => {
    const enterpriseRegistrationUuid = uuid.v1(),
      enterpriseRegistrationStepArr = [
        {
          uuid: enterpriseRegistrationUuid,
          step: 1,
          status: 2,
          statusText: '正在进行',
          managerUuid: managerProjectUuid
        },
        {
          uuid: enterpriseRegistrationUuid,
          step: 2,
          status: 1,
          statusText: '未开始',
          managerUuid: managerProjectUuid
        },
        {
          uuid: enterpriseRegistrationUuid,
          step: 3,
          status: 1,
          statusText: '未开始',
          managerUuid: managerProjectUuid
        },
        {
          uuid: enterpriseRegistrationUuid,
          step: 4,
          status: 1,
          statusText: '未开始',
          managerUuid: managerProjectUuid
        },
        {
          uuid: enterpriseRegistrationUuid,
          step: 5,
          status: 1,
          statusText: '未开始',
          managerUuid: managerProjectUuid
        },
        {
          uuid: enterpriseRegistrationUuid,
          step: 6,
          status: 1,
          statusText: '未开始',
          managerUuid: managerProjectUuid
        }
      ];

    db.transaction(() => {
      return Promise.all([
        enterpriseRegistration.create({
          name,
          currentStep: 1,
          uuid: enterpriseRegistrationUuid,
          enterpriseUuid: enterpriseUuid
        }),
        enterpriseRegistrationStep.bulkCreate(enterpriseRegistrationStepArr),
        enterpriseRegistrationCopyright.create({
          uuid: enterpriseRegistrationUuid,
          status: 1,
          statusText: '未上传'
        }),
        enterpriseRegistrationContract.create({
          uuid: enterpriseRegistrationUuid,
          status: 1,
          statusText: '未填写'
        }),
        enterpriseRegistrationSpecimen.create({
          uuid: enterpriseRegistrationUuid,
          status: 1,
          statusText: '未填写'
        }),
        enterpriseRegistrationProduct.create({
          uuid: enterpriseRegistrationUuid,
          status: 1,
          statusText: '未上传'
        }),
        enterpriseRegistrationProductDescription.create({
          uuid: enterpriseRegistrationUuid,
          status: 1,
          statusText: '未上传'
        }),
        enterpriseRegistrationDocument.create({
          uuid: enterpriseRegistrationUuid,
          status: 1,
          statusText: '未上传'
        }),
        enterpriseRegistrationApply.create({
          uuid: enterpriseRegistrationUuid,
          status: 1,
          statusText: '未填写'
        }),
        enterpriseRegistrationBasic.create({
          uuid: enterpriseRegistrationUuid,
          status: 1,
          statusText: '未填写'
        })
      ]);
    });

    return enterpriseRegistrationUuid;
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
   * 根据enterpriseRegistrationUuid查询具体步骤状态
   */
  queryEnterpriseRegistrationStepByRegistrationUuid: async registrationUuid => {
    return await enterpriseRegistrationStep.findAll({
      where: { uuid: registrationUuid },
      attributes: ['step', 'status', 'statusText', 'managerUuid'],
      raw: true
    });
  },

  /**
   *  无参数查询sys_registration_step表
   */
  querySysRegistrationStep: async () => {
    return await sysRegistrationStep.findAll({
      attributes: ['name', 'step']
    });
  },

  /**
   * 查询的评测合同的基本信息
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
  saveRegistrationContract: async ({
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
   * 查询的样品登记表的基本信息
   */
  selectRegistrationSpecimenByRegistrationUuid: async registrationUuid => {
    return await enterpriseRegistrationSpecimen.findOne({
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
      where: { uuid: registrationUuid }
    });
  },

  /**
   * 保存样品登记表的基本信息
   */
  saveRegistrationSpecimen: async ({
    registrationUuid,
    trademark,
    developmentTool,
    securityClassification,
    email,
    unit,
    status,
    statusText,
    failText
  }) => {
    return await enterpriseRegistrationSpecimen.update(
      {
        trademark,
        developmentTool,
        securityClassification,
        email,
        unit,
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
   * 查询的产品说明信息
   */
  selectRegistrationProductDescriptionByRegistrationUuid: async registrationUuid => {
    return await enterpriseRegistrationProductDescription.findOne({
      attributes: ['url', 'failText', 'status', 'statusText'],
      raw: true,
      where: { uuid: registrationUuid }
    });
  },

  /**
   * 保存产品说明信息
   */
  saveRegistrationProductDescription: async ({
    registrationUuid,
    productDescriptionUrl,
    status,
    statusText,
    failText
  }) => {
    // 这里还得更新状态信息为2待审核
    return await enterpriseRegistrationProductDescription.update(
      {
        url: productDescriptionUrl,
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
   * 设置评测合同的状态
   */
  setContractStatus: async ({
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
   * 设置样品文档集的状态
   */
  setSpecimenStatus: async ({
    registrationUuid,
    status,
    failText,
    statusText
  }) => {
    return await enterpriseRegistrationSpecimen.update(
      { status, failText, statusText },
      {
        where: { uuid: registrationUuid }
      }
    );
  },

  /**
   * 设置产品描述的状态
   */
  setProductDescriptionStatus: async ({
    registrationUuid,
    status,
    failText,
    statusText
  }) => {
    return await enterpriseRegistrationProductDescription.update(
      { status, failText, statusText },
      {
        where: { uuid: registrationUuid }
      }
    );
  },

  /**
   * 更新登记测试的步骤
   */
  updateRegistrationCurrentStep: async ({ registrationUuid, currentStep }) => {
    return await enterpriseRegistration.update(
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
   * 更新登记测试的步骤
   */
  updateRegistrationStep: async ({
    registrationUuid,
    status,
    statusText,
    step
  }) => {
    return await enterpriseRegistrationStep.update(
      {
        status,
        statusText
      },
      {
        where: {
          uuid: registrationUuid,
          step
        }
      }
    );
  }
};
