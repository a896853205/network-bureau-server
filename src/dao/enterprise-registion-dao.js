import enterpriseRegistionApply from '../db/models/enterprise-registion-apply';
import enterpriseRegistionCopyright from '../db/models/enterprise-registion-copyright';
import enterpriseRegistionDocument from '../db/models/enterprise-registion-document';
import enterpriseRegistionProductDescription from '../db/models/enterprise-registion-product-description';
import enterpriseRegistionProduct from '../db/models/enterprise-registion-product';
import enterpriseRegistion from '../db/models/enterprise-registion';
import mergeEnterpriseRegistionRegistionStep from '../db/models/merge-enterprise-registion-registion-step';
import sysRegistionStep from '../db/models/sys-registion-step';

import uuid from 'uuid';

export default {
  selectEnterpriseRegistionByName: async name => {
    return await enterpriseRegistion.findOne({
      where: { name }
    });
  },

  createEnterpriseRegistion: async (name, enterpriseUuid) => {
    const enterpriseRegistionUuid = uuid.v1();
    const contractUuid = uuid.v1();
    const copyrightUuid = uuid.v1();
    const specimenUuid = uuid.v1();
    const productuid = uuid.v1();
    const productDescriptionUuid = uuid.v1();
    const documentUuid = uuid.v1();
    const applyUuid = uuid.v1();
    return await Promise.all([
      enterpriseRegistion.create({
        name,
        currentStep: 0,
        uuid: enterpriseRegistionUuid,
        enterpriseUuid: enterpriseUuid,
        contractUuid,
        copyrightUuid,
        specimenUuid,
        productuid,
        productDescriptionUuid,
        documentUuid,
        applyUuid
      }),
      // enterpriseRegistion.create({
      //   uuid: contractUuid,
      //   status: 0,
      //   statusText: null
      // }),
      enterpriseRegistionCopyright.create({
        uuid: copyrightUuid,
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
        uuid: productuid,
        status: 0,
        statusText: null,
        url: null
      }),
      enterpriseRegistionProductDescription.create({
        uuid: productDescriptionUuid,
        status: 0,
        statusText: null,
        url: null
      }),
      enterpriseRegistionDocument.create({
        uuid: documentUuid,
        status: 0,
        statusText: null,
        url: null
      }),
      enterpriseRegistionApply.create({
        uuid: applyUuid,
        status: 0,
        statusText: null,
        step: 0
      })
    ]);
  }
};
