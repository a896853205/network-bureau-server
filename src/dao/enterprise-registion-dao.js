import { db } from '../db/db-connect';

import enterpriseRegistionApply from '../db/models/enterprise-registion-apply';
import enterpriseRegistionCopyright from '../db/models/enterprise-registion-copyright';
import enterpriseRegistionDocument from '../db/models/enterprise-registion-document';
import enterpriseRegistionProductDescription from '../db/models/enterprise-registion-product-description';
import enterpriseRegistionProduct from '../db/models/enterprise-registion-product';
import enterpriseRegistion from '../db/models/enterprise-registion';
import mergeEnterpriseRegistionRegistionStep from '../db/models/merge-enterprise-registion-registion-step';
import sysRegistionStep from '../db/models/sys-registion-step';

import { QUERY_REGISTION_PAGE_SIZE } from '../config/system-config';

import uuid from 'uuid';

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
          currentStep: 0,
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
  queryRegistionItems: async (enterpriseUuid, page) => {
    const result = await enterpriseRegistion.findAndCountAll({
      where: { enterpriseUuid },
      attributes: ['uuid', 'enterpriseUuid', 'name', 'currentStep'],
      limit: QUERY_REGISTION_PAGE_SIZE,
      offset: (page - 1) * QUERY_REGISTION_PAGE_SIZE,
      raw: true
    });
    console.log(enterpriseUuid);
    return {
      enterpriseRegistionList: result.rows,
      total: result.count,
      pageSize: QUERY_REGISTION_PAGE_SIZE
    };
  }
};
