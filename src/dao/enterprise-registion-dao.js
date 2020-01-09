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
  selectRegistionByEnterpriseUuid: async (uuid) => {
      const result = await Promise.all([ 
      //
      enterpriseRegistion.findOne({
        where: { uuid },
        attributes: ['uuid', 'enterpriseUuid', 'name', 'currentStep'],
        raw: true
      }),

     
      
    ]);

    return {
      result1:[result1.status,result1.statusText],
      result2:[result2.status,result2.statusText],
      result3:[result3.status,result3.statusText],
      result4:[result4.status,result4.statusText],
      result5:[result5.status,result5.statusText],
      result6:[result6.status,result6.statusText],
      result7:[result7.status,result7.statusText],
    }
  }
};