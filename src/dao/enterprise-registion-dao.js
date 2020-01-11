import { db } from '../db/db-connect';

import enterpriseRegistionApply from '../db/models/enterprise-registion-apply';
import enterpriseRegistionContract from '../db/models/enterprise-registion-contract';
import enterpriseRegistionCopyright from '../db/models/enterprise-registion-copyright';
import enterpriseRegistionDocument from '../db/models/enterprise-registion-document';
import enterpriseRegistionProductDescription from '../db/models/enterprise-registion-product-description';
import enterpriseRegistionProduct from '../db/models/enterprise-registion-product';
import enterpriseRegistionSpecimen from '../db/models/enterprise-registion-specimen';
import enterpriseRegistion from '../db/models/enterprise-registion';
import mergeEnterpriseRegistionRegistionStep from '../db/models/merge-enterprise-registion-registion-step';
import sysRegistionStep from '../db/models/sys-registion-step';

import { REGISTRATION_PAGE_SIZE } from '../config/system-config';

import uuid from 'uuid';
import { promises } from 'graceful-fs';

export default {
  /**.
   * 通过name查询登记注册
   */
  selectEnterpriseRegistionByName: async name => {
    return await enterpriseRegistion.findOne({
      where: { name }
    });
  },

  /**
   * 创建一个登记注册
   */
  createEnterpriseRegistion: async (name, enterpriseUuid) => {
    const enterpriseRegistionUuid = uuid.v1();

    return db.transaction(() => {
      return Promise.all([
        enterpriseRegistion.create({
          name,
          currentStep: 1,
          uuid: enterpriseRegistionUuid,
          enterpriseUuid: enterpriseUuid
        }),
        // enterpriseRegistion.create({
        //   uuid: contractUuid,
        //   status: 0,
        //   statusText: null
        // }),
        enterpriseRegistionCopyright.create({
          uuid: enterpriseRegistionUuid,
          status: 0,
          statusText: null,
          url: null
        }),
        enterpriseRegistionContract.create({
          uuid: enterpriseRegistionUuid,
          status: 0,
          statusText: null,
          url: null
        }),
        enterpriseRegistionSpecimen.create({
          uuid: enterpriseRegistionUuid,
          status: 0,
          statusText: null,
          url: null
        }),
        // enterpriseRegistion.create({
        //   uuid: specimenUuid,
        //   status: 0,
        //   statusText: null
        // }),
        enterpriseRegistionProduct.create({
          uuid: enterpriseRegistionUuid,
          status: 0,
          statusText: null,
          url: null
        }),
        enterpriseRegistionProductDescription.create({
          uuid: enterpriseRegistionUuid,
          status: 0,
          statusText: null,
          url: null
        }),
        enterpriseRegistionDocument.create({
          uuid: enterpriseRegistionUuid,
          status: 0,
          statusText: null,
          url: null
        }),
        enterpriseRegistionApply.create({
          uuid: enterpriseRegistionUuid,
          status: 0,
          statusText: null,
          step: 0
        })
      ]);
    });
  },

  /**
   * 查询企业用户登记测试
   */
  queryRegistionByEnterpriseUuid: async (enterpriseUuid, page) => {
    const result = await enterpriseRegistion.findAndCountAll({
      where: { enterpriseUuid },
      attributes: ['uuid', 'enterpriseUuid', 'name', 'currentStep'],
      limit: REGISTRATION_PAGE_SIZE,
      offset: (page - 1) * REGISTRATION_PAGE_SIZE,
      raw: true
    });

    return {
      enterpriseRegistionList: result.rows,
      total: result.count,
      pageSize: REGISTRATION_PAGE_SIZE
    };
  },

  /**
   * 查询企业用户登记测试七个状态通过uuid
   */
  selectRegistionByEnterpriseUuid: async uuid => {
    const [
      enterpriseRegistionContractStatus,
      enterpriseRegistionCopyrightStatus,
      enterpriseRegistionSpecimenStatus,
      enterpriseRegistionProductDescriptionStatus,
      enterpriseRegistionDocumentStatus,
      enterpriseRegistionProductStatus,
      enterpriseRegistionApplyStatus
    ] = await Promise.all([
      // 评测合同
      enterpriseRegistionContract.findOne({
        where: { uuid },
        attributes: ['uuid', 'status', 'statusText'],
        raw: true
      }),
      // 软件著作权证书表
      enterpriseRegistionCopyright.findOne({
        where: { uuid },
        attributes: ['uuid', 'status', 'statusText'],
        raw: true
      }),
      // 样品登记表
      enterpriseRegistionSpecimen.findOne({
        where: { uuid },
        attributes: ['uuid', 'status', 'statusText'],
        raw: true
      }),
      // 产品说明表
      enterpriseRegistionProductDescription.findOne({
        where: { uuid },
        attributes: ['uuid', 'status', 'statusText'],
        raw: true
      }),
      // 用户文档表
      enterpriseRegistionDocument.findOne({
        where: { uuid },
        attributes: ['uuid', 'status', 'statusText'],
        raw: true
      }),
      // 产品介质表
      enterpriseRegistionProduct.findOne({
        where: { uuid },
        attributes: ['uuid', 'status', 'statusText'],
        raw: true
      }),
      // 现场测试申请表
      enterpriseRegistionApply.findOne({
        where: { uuid },
        attributes: ['uuid', 'status', 'statusText'],
        raw: true
      })
    ]);

    return {
      enterpriseRegistionContractStatus,
      enterpriseRegistionCopyrightStatus,
      enterpriseRegistionSpecimenStatus,
      enterpriseRegistionProductDescriptionStatus,
      enterpriseRegistionDocumentStatus,
      enterpriseRegistionProductStatus,
      enterpriseRegistionApplyStatus
    };
  }
};
