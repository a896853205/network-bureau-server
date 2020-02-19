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
      const [
        enterpriseRegistrationApplyStatus,
        enterpriseRegistrationContractStatus,
        enterpriseRegistrationCopyrightStatus,
        enterpriseRegistrationDocumentStatus,
        enterpriseRegistrationProductDescriptionStatus,
        enterpriseRegistrationProductStatus,
        enterpriseRegistrationSpecimenStatus,
        enterpriseRegistrationBasicStatus
      ] = await Promise.all([
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

      return {
        enterpriseRegistrationApplyStatus,
        enterpriseRegistrationContractStatus,
        enterpriseRegistrationCopyrightStatus,
        enterpriseRegistrationDocumentStatus,
        enterpriseRegistrationProductDescriptionStatus,
        enterpriseRegistrationProductStatus,
        enterpriseRegistrationSpecimenStatus,
        enterpriseRegistrationBasicStatus
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * 查询登记测试的基本信息
   */
  selectRegistrationBasicByRegistrationUuid: registrationUuid =>
    enterpriseRegistrationBasicDao.selectRegistrationBasicByRegistrationUuid(
      registrationUuid
    ),

  /**
   * 保存登记测试的基本信息
   */
  saveRegistrationBasic: ({
    registrationUuid,
    version,
    linkman,
    client,
    phone,
    address,
    devStartTime,
    enterpriseName
  }) =>
    enterpriseRegistrationBasicDao.updateRegistrationBasic({
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
    }),

  /**
   * 查询评测合同的基本信息
   */
  selectRegistrationContractByRegistrationUuid: registrationUuid =>
    enterpriseRegistrationContractDao.selectRegistrationContractByRegistrationUuid(
      registrationUuid
    ),

  /**
   * 保存评测合同的基本信息
   */
  saveRegistrationContract: ({
    registrationUuid,
    amount,
    fax,
    postalCode,
    mainFunction,
    techIndex
  }) =>
    enterpriseRegistrationContractDao.updateRegistrationContract({
      registrationUuid,
      amount,
      fax,
      postalCode,
      mainFunction,
      techIndex,
      status: 1,
      statusText: '待审核',
      failText: ''
    }),

  /**
   * 查询样品登记表信息
   */
  selectRegistrationSpecimenByRegistrationUuid: registrationUuid =>
    enterpriseRegistrationSpecimenDao.selectRegistrationSpecimenByRegistrationUuid(
      registrationUuid
    ),

  /**
   * 保存样品登记表信息
   */
  saveRegistrationSpecimen: ({
    registrationUuid,
    trademark,
    developmentTool,
    securityClassification,
    email,
    unit
  }) =>
    enterpriseRegistrationSpecimenDao.updateRegistrationSpecimen({
      registrationUuid,
      trademark,
      developmentTool,
      securityClassification,
      email,
      unit,
      status: 1,
      statusText: '待审核',
      failText: ''
    }),

  /**
   * 查询现场测试申请表的基本信息
   */
  selectRegistrationApplyByRegistrationUuid: registrationUuid =>
    enterpriseRegistrationApplyDao.selectRegistrationApplyByRegistrationUuid(
      registrationUuid
    ),

  /**
   * 保存现场测试申请表的基本信息
   */
  saveRegistrationApply: ({ registrationUuid, content }) =>
    enterpriseRegistrationApplyDao.updateRegistrationApply({
      registrationUuid,
      content,
      status: 1,
      statusText: '待审核',
      failText: ''
    }),

  /**
   * 获取软件著作权的信息
   */
  selectRegistrationCopyright: ({ registrationUuid }) =>
    enterpriseRegistrationCopyrightDao.selectRegistrationCopyrightByRegistrationUuid(
      registrationUuid
    ),

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

      return await enterpriseRegistrationCopyrightDao.updateRegistrationCopyright(
        {
          registrationUuid,
          copyrightUrl: productionUrl,
          status: 1,
          statusText: '待审核',
          failText: ''
        }
      );
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  /**
   * 获取用户文档集的信息
   */
  selectRegistrationDocument: ({ registrationUuid }) =>
    enterpriseRegistrationDocumentDao.selectRegistrationDocumentByRegistrationUuid(
      registrationUuid
    ),

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
      throw error;
    }
  },

  /**
   * 获取产品说明的信息
   */
  selectRegistrationProductDescription: ({ registrationUuid }) =>
    enterpriseRegistrationProductDescriptionDao.selectRegistrationProductDescriptionByRegistrationUuid(
      registrationUuid
    ),

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

      return await enterpriseRegistrationProductDescriptionDao.updateRegistrationProductDescription(
        {
          registrationUuid,
          productDescriptionUrl: productionUrl,
          status: 1,
          statusText: '待审核',
          failText: ''
        }
      );
    } catch (error) {
      throw error;
    }
  },

  /**
   * 获取产品介质的信息
   */
  selectRegistrationProduct: ({ registrationUuid }) =>
    enterpriseRegistrationProductDao.selectRegistrationProductByRegistrationUuid(
      registrationUuid
    ),

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

      return await enterpriseRegistrationProductDao.updateRegistrationProduct({
        registrationUuid,
        productUrl: productionUrl,
        status: 1,
        statusText: '待审核',
        failText: ''
      });
    } catch (error) {
      throw error;
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
    try {
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
    } catch (error) {
      throw error;
    }
  }
};
