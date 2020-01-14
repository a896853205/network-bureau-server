import { db } from '../../db/db-connect';

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

import { REGISTRATION_PAGE_SIZE } from '../../config/system-config';

import uuid from 'uuid';
import managerUser from '../../db/models/manager-user';

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
      attributes: ['uuid', 'currentStep', 'name']
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
          statusText: '未开始'
        },
        {
          uuid: enterpriseRegistrationUuid,
          step: 3,
          status: 1,
          statusText: '未开始'
        },
        {
          uuid: enterpriseRegistrationUuid,
          step: 4,
          status: 1,
          statusText: '未开始'
        },
        {
          uuid: enterpriseRegistrationUuid,
          step: 5,
          status: 1,
          statusText: '未开始'
        },
        {
          uuid: enterpriseRegistrationUuid,
          step: 6,
          status: 1,
          statusText: '未开始'
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
          status: 0,
          statusText: null,
          url: null
        }),
        enterpriseRegistrationContract.create({
          uuid: enterpriseRegistrationUuid,
          status: 0,
          statusText: null,
          url: null
        }),
        enterpriseRegistrationSpecimen.create({
          uuid: enterpriseRegistrationUuid,
          status: 0,
          statusText: null,
          url: null
        }),
        // enterpriseRegistration.create({
        //   uuid: specimenUuid,
        //   status: 0,
        //   statusText: null
        // }),
        enterpriseRegistrationProduct.create({
          uuid: enterpriseRegistrationUuid,
          status: 0,
          statusText: null,
          url: null
        }),
        enterpriseRegistrationProductDescription.create({
          uuid: enterpriseRegistrationUuid,
          status: 0,
          statusText: null,
          url: null
        }),
        enterpriseRegistrationDocument.create({
          uuid: enterpriseRegistrationUuid,
          status: 0,
          statusText: null,
          url: null
        }),
        enterpriseRegistrationApply.create({
          uuid: enterpriseRegistrationUuid,
          status: 0,
          statusText: null,
          step: 0
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
      enterpriseRegistrationContractStatus,
      enterpriseRegistrationCopyrightStatus,
      enterpriseRegistrationSpecimenStatus,
      enterpriseRegistrationProductDescriptionStatus,
      enterpriseRegistrationDocumentStatus,
      enterpriseRegistrationProductStatus,
      enterpriseRegistrationApplyStatus
    ] = await Promise.all([
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
  }
};
