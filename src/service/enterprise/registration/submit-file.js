// oss
import client from '../../../util/oss';

// dao
import enterpriseRegistrationBasicDao from '../../../dao/enterprise/enterprise-registration-basic-dao';
import enterpriseRegistrationContractDao from '../../../dao/enterprise/enterprise-registration-contract-dao';
import enterpriseRegistrationSpecimenDao from '../../../dao/enterprise/enterprise-registration-specimen-dao';
import enterpriseRegistrationApplyDao from '../../../dao/enterprise/enterprise-registration-apply-dao';
import enterpriseRegistrationCopyrightDao from '../../../dao/enterprise/enterprise-registration-copyright-dao';
import enterpriseRegistrationDocumentDao from '../../../dao/enterprise/enterprise-registration-document-dao';
import enterpriseRegistrationProductDescriptionDao from '../../../dao/enterprise/enterprise-registration-product-description-dao';
import enterpriseRegistrationProductDao from '../../../dao/enterprise/enterprise-registration-product-dao';

export default {
  /**
   * 查询企业用户登记测试八个状态通过uuid
   */
  selectRegistrationStatusByRegistrationUuid: async registrationUuid => {
    try {
      return await Promise.all([
        enterpriseRegistrationBasicDao.selectRegistrationBasicByRegistrationUuid(
          registrationUuid
        ),
        enterpriseRegistrationContractDao.selectRegistrationContractByRegistrationUuid(
          registrationUuid
        ),
        enterpriseRegistrationCopyrightDao.selectRegistrationCopyrightByRegistrationUuid(
          registrationUuid
        ),
        enterpriseRegistrationSpecimenDao.selectRegistrationSpecimenByRegistrationUuid(
          registrationUuid
        ),
        enterpriseRegistrationProductDescriptionDao.selectRegistrationProductDescriptionByRegistrationUuid(
          registrationUuid
        ),
        enterpriseRegistrationDocumentDao.selectRegistrationDocumentByRegistrationUuid(
          registrationUuid
        ),
        enterpriseRegistrationProductDao.selectRegistrationProductByRegistrationUuid(
          registrationUuid
        ),
        enterpriseRegistrationApplyDao.selectRegistrationApplyByRegistrationUuid(
          registrationUuid
        )
      ]);
    } catch (error) {
      console.error('查询企业用户登记测试八个状态错误');
      throw error;
    }
  },

  /**
   * 查询登记测试的基本信息
   */
  selectRegistrationBasicByRegistrationUuid: async registrationUuid => {
    return await enterpriseRegistrationBasicDao.selectRegistrationBasicByRegistrationUuid(
      registrationUuid
    );
  },

  /**
   * 保存登记测试的基本信息
   */
  saveRegistrationBasic: async ({
    registrationUuid,
    version,
    linkman,
    client,
    phone,
    address,
    devStartTime,
    enterpriseName
  }) => {
    return await enterpriseRegistrationBasicDao.updateRegistrationBasic({
      registrationUuid,
      version,
      linkman,
      client,
      phone,
      address,
      devStartTime,
      enterpriseName,
      status: 1,
      statusText: '待审核',
      failText: ''
    });
  },

  /**
   * 查询评测合同的基本信息
   */
  selectRegistrationContractByRegistrationUuid: async registrationUuid => {
    return await enterpriseRegistrationContractDao.selectRegistrationContractByRegistrationUuid(
      registrationUuid
    );
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
    techIndex
  }) => {
    return await enterpriseRegistrationContractDao.updateRegistrationContract({
      registrationUuid,
      amount,
      fax,
      postalCode,
      mainFunction,
      techIndex,
      status: 1,
      statusText: '待审核',
      failText: ''
    });
  },

  /**
   * 查询样品登记表信息
   */
  selectRegistrationSpecimenByRegistrationUuid: async registrationUuid => {
    return await enterpriseRegistrationSpecimenDao.selectRegistrationSpecimenByRegistrationUuid(
      registrationUuid
    );
  },

  /**
   * 保存样品登记表信息
   */
  saveRegistrationSpecimen: async ({
    registrationUuid,
    trademark,
    developmentTool,
    securityClassification,
    email,
    unit
  }) => {
    return await enterpriseRegistrationSpecimenDao.updateRegistrationSpecimen({
      registrationUuid,
      trademark,
      developmentTool,
      securityClassification,
      email,
      unit,
      status: 1,
      statusText: '待审核',
      failText: ''
    });
  },

  /**
   * 查询现场测试申请表的基本信息
   */
  selectRegistrationApplyByRegistrationUuid: async registrationUuid => {
    return await enterpriseRegistrationApplyDao.selectRegistrationApplyByRegistrationUuid(
      registrationUuid
    );
  },

  /**
   * 保存现场测试申请表的基本信息
   */
  saveRegistrationApply: async ({ registrationUuid, content }) => {
    return await enterpriseRegistrationApplyDao.updateRegistrationApply({
      registrationUuid,
      content,
      status: 1,
      statusText: '待审核',
      failText: ''
    });
  },

  /**
   * 获取软件著作权的信息
   */
  selectRegistrationCopyright: async ({ registrationUuid }) => {
    return await enterpriseRegistrationCopyrightDao.selectRegistrationCopyrightByRegistrationUuid(
      registrationUuid
    );
  },

  /**
   * 保存软件著作权的信息
   */
  saveRegistrationCopyright: async ({ registrationUuid, copyrightUrl }) => {
    try {
      let productionUrl = '';
      // 将temp的文件copy到production中
      const [filePosition] = copyrightUrl.split('/');

      if (filePosition === 'temp') {
        const tempUrl = copyrightUrl;
        productionUrl = copyrightUrl.replace('temp', 'production');

        const copyright = await enterpriseRegistrationCopyrightDao.selectRegistrationCopyrightByRegistrationUuid(
          registrationUuid
        );

        if (copyright?.url) {
          await client.delete(copyright.url);
        }

        await client.copy(productionUrl, tempUrl);
      } else if (filePosition === 'production') {
        productionUrl = copyrightUrl;
      } else {
        throw new Error('oss文件路径错误');
      }

      await enterpriseRegistrationCopyrightDao.updateRegistrationCopyright({
        registrationUuid,
        copyrightUrl: productionUrl,
        status: 1,
        statusText: '待审核',
        failText: ''
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  /**
   * 获取用户文档集的信息
   */
  selectRegistrationDocument: async ({ registrationUuid }) => {
    return await enterpriseRegistrationDocumentDao.selectRegistrationDocumentByRegistrationUuid(
      registrationUuid
    );
  },

  /**
   * 保存用户文档集的信息
   */
  saveRegistrationDocument: async ({ registrationUuid, documentUrl }) => {
    try {
      let productionUrl = '';
      // 将temp的文件copy到production中
      const [filePosition] = documentUrl.split('/');

      if (filePosition === 'temp') {
        const tempUrl = documentUrl;
        productionUrl = documentUrl.replace('temp', 'production');

        const document = await enterpriseRegistrationDocumentDao.selectRegistrationDocumentByRegistrationUuid(
          registrationUuid
        );

        if (document?.url) {
          await client.delete(document.url);
        }

        await client.copy(productionUrl, tempUrl);
      } else if (filePosition === 'production') {
        productionUrl = documentUrl;
      } else {
        throw Error('oss文件路径错误');
      }

      await enterpriseRegistrationDocumentDao.updateRegistrationDocument({
        registrationUuid,
        documentUrl: productionUrl,
        status: 1,
        statusText: '待审核',
        failText: ''
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  /**
   * 获取产品说明的信息
   */
  selectRegistrationProductDescription: async ({ registrationUuid }) => {
    return await enterpriseRegistrationProductDescriptionDao.selectRegistrationProductDescriptionByRegistrationUuid(
      registrationUuid
    );
  },

  /**
   * 保存产品说明的信息
   */
  saveRegistrationProductDescription: async ({
    registrationUuid,
    productDescriptionUrl
  }) => {
    try {
      let productionUrl = '';
      // 将temp的文件copy到production中
      const [filePosition] = productDescriptionUrl.split('/');

      if (filePosition === 'temp') {
        const tempUrl = productDescriptionUrl;
        productionUrl = productDescriptionUrl.replace('temp', 'production');
        const productDescription = await enterpriseRegistrationProductDescriptionDao.selectRegistrationProductDescriptionByRegistrationUuid(
          registrationUuid
        );

        if (productDescription?.url) {
          await client.delete(productDescription.url);
        }

        await client.copy(productionUrl, tempUrl);
      } else if (filePosition === 'production') {
        productionUrl = productDescriptionUrl;
      } else {
        throw Error('oss文件路径错误');
      }

      await enterpriseRegistrationProductDescriptionDao.updateRegistrationProductDescription(
        {
          registrationUuid,
          productDescriptionUrl: productionUrl,
          status: 1,
          statusText: '待审核',
          failText: ''
        }
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  /**
   * 获取产品介质的信息
   */
  selectRegistrationProduct: async ({ registrationUuid }) => {
    return await enterpriseRegistrationProductDao.selectRegistrationProductByRegistrationUuid(
      registrationUuid
    );
  },

  /**
   * 保存产品介质的信息
   */
  saveRegistrationProduct: async ({ registrationUuid, productUrl }) => {
    try {
      let productionUrl = '';
      // 将temp的文件copy到production中
      const [filePosition] = productUrl.split('/');

      if (filePosition === 'temp') {
        const tempUrl = productUrl;
        productionUrl = productUrl.replace('temp', 'production');
        const product = await enterpriseRegistrationProductDao.selectRegistrationProductByRegistrationUuid(
          registrationUuid
        );

        if (product?.url) {
          await client.delete(product.url);
        }

        await client.copy(productionUrl, tempUrl);
      } else if (filePosition === 'production') {
        productionUrl = productUrl;
      } else {
        throw Error('oss文件路径错误');
      }

      await enterpriseRegistrationProductDao.updateRegistrationProduct({
        registrationUuid,
        productUrl: productionUrl,
        status: 1,
        statusText: '待审核',
        failText: ''
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  /**
   * 设置登记测试第一步8个信息的状态
   */
  setRegistrationDetailStatus: async ({
    registrationUuid,
    type,
    failText,
    isPass
  }) => {
    const statusDao = {
      basic: enterpriseRegistrationBasicDao.updateBasicStatus,
      contract: enterpriseRegistrationContractDao.updateContractStatus,
      product: enterpriseRegistrationProductDao.updateProductStatus,
      productDescription:
        enterpriseRegistrationProductDescriptionDao.updateProductDescriptionStatus,
      apply: enterpriseRegistrationApplyDao.updateApplyStatus,
      copyright: enterpriseRegistrationCopyrightDao.updateCopyrightStatus,
      document: enterpriseRegistrationDocumentDao.updateDocumentStatus,
      specimen: enterpriseRegistrationSpecimenDao.updateSpecimenStatus
    };

    const getStatusDao = type => {
      if (!statusDao[type]) throw new Error('错误类型');

      return statusDao[type];
    };

    return await getStatusDao(type)({
      registrationUuid,
      status: isPass ? 100 : -1,
      failText,
      statusText: isPass ? '已审核' : '内容错误'
    });
  }
};
