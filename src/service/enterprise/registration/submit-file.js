import { db } from '../../../db/db-connect';

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
import enterpriseRegistrationStepDao from '../../../dao/enterprise/enterprise-registration-step-dao';
import enterpriseRegistrationDao from '../../../dao/enterprise/enterprise-registration-dao';

// 工具类
import CustomError from '../../../util/custom-error';

const _finishSubmitFile = async ({ registrationUuid, transaction }) => {
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
    enterpriseRegistrationBasicDao.selectRegistrationBasicByRegistrationUuid({
      registrationUuid,
      transaction
    }),
    enterpriseRegistrationContractDao.selectRegistrationContractByRegistrationUuid(
      {
        registrationUuid,
        transaction
      }
    ),
    enterpriseRegistrationCopyrightDao.selectRegistrationCopyrightByRegistrationUuid(
      {
        registrationUuid,
        transaction
      }
    ),
    enterpriseRegistrationSpecimenDao.selectRegistrationSpecimenByRegistrationUuid(
      {
        registrationUuid,
        transaction
      }
    ),
    enterpriseRegistrationProductDescriptionDao.selectRegistrationProductDescriptionByRegistrationUuid(
      {
        registrationUuid,
        transaction
      }
    ),
    enterpriseRegistrationDocumentDao.selectRegistrationDocumentByRegistrationUuid(
      {
        registrationUuid,
        transaction
      }
    ),
    enterpriseRegistrationProductDao.selectRegistrationProductByRegistrationUuid(
      {
        registrationUuid,
        transaction
      }
    ),
    enterpriseRegistrationApplyDao.selectRegistrationApplyByRegistrationUuid({
      registrationUuid,
      transaction
    })
  ]);

  if (
    enterpriseRegistrationBasicStatus.status === 100 &&
    enterpriseRegistrationContractStatus.status === 100 &&
    enterpriseRegistrationCopyrightStatus.status === 100 &&
    enterpriseRegistrationSpecimenStatus.status === 100 &&
    enterpriseRegistrationProductDescriptionStatus.status === 100 &&
    enterpriseRegistrationDocumentStatus.status === 100 &&
    enterpriseRegistrationProductStatus.status === 100 &&
    enterpriseRegistrationApplyStatus.status === 100
  ) {
    // 改进度和steps表
    await Promise.all([
      enterpriseRegistrationDao.updateRegistrationCurrentStep({
        registrationUuid,
        currentStep: 2,
        transaction
      }),
      enterpriseRegistrationStepDao.updateRegistrationStep({
        registrationUuid,
        status: 100,
        statusText: '已完成',
        step: 1,
        transaction
      }),
      enterpriseRegistrationStepDao.updateRegistrationStep({
        registrationUuid,
        status: 1,
        statusText: '管理员填写内容',
        step: 2,
        transaction
      })
    ]);
  }
};

export default {
  /**
   * 查询企业用户登记测试八个状态通过uuid
   */
  selectRegistrationStatusByRegistrationUuid: async registrationUuid => {
    try {
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
        enterpriseRegistrationBasicDao.selectRegistrationBasicByRegistrationUuid(
          {
            registrationUuid
          }
        ),
        enterpriseRegistrationContractDao.selectRegistrationContractByRegistrationUuid(
          {
            registrationUuid
          }
        ),
        enterpriseRegistrationCopyrightDao.selectRegistrationCopyrightByRegistrationUuid(
          {
            registrationUuid
          }
        ),
        enterpriseRegistrationSpecimenDao.selectRegistrationSpecimenByRegistrationUuid(
          { registrationUuid }
        ),
        enterpriseRegistrationProductDescriptionDao.selectRegistrationProductDescriptionByRegistrationUuid(
          { registrationUuid }
        ),
        enterpriseRegistrationDocumentDao.selectRegistrationDocumentByRegistrationUuid(
          { registrationUuid }
        ),
        enterpriseRegistrationProductDao.selectRegistrationProductByRegistrationUuid(
          { registrationUuid }
        ),
        enterpriseRegistrationApplyDao.selectRegistrationApplyByRegistrationUuid(
          { registrationUuid }
        )
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
    } catch (error) {
      throw error;
    }
  },

  /**
   * 查询登记测试的基本信息
   */
  selectRegistrationBasicByRegistrationUuid: registrationUuid =>
    enterpriseRegistrationBasicDao.selectRegistrationBasicByRegistrationUuid({
      registrationUuid
    }),

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
  }) => {
    try {
      const phoneReg = /^(\d)(\d|-){4,20}$/,
        versionReg = /^(\d{1,2})(.([1-9]\d|\d)){2}$/;

      if (!versionReg.test(version)) {
        throw new CustomError('版本不符合规则!');
      }
      if (!linkman.length || linkman.length > 32) {
        throw new CustomError('联系人长度不符合规则!');
      }
      if (!client.length || client.length > 32) {
        throw new CustomError('委托单位(人)长度不符合规则!');
      }
      if (!address.length || address.length > 32) {
        throw new CustomError('注册地址长度不符合规则!');
      }
      if (!phoneReg.test(phone)) {
        throw new CustomError('电话号码不符合规则!');
      }
      if (!enterpriseName.length || enterpriseName.length > 32) {
        throw new CustomError('开发单位全称长度不符合规则!');
      }

      return db.transaction(async transaction => {
        const {
          currentStep
        } = await enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
          {
            registrationUuid,
            transaction
          }
        );
        if (!currentStep === 1) {
          throw new CustomError('当前步骤不允许保存基本信息!');
        } else {
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
            failText: '',
            transaction
          });
        }
      });
    } catch (error) {
      throw error;
    }
  },
  /**
   * 查询评测合同的基本信息
   */
  selectRegistrationContractByRegistrationUuid: registrationUuid =>
    enterpriseRegistrationContractDao.selectRegistrationContractByRegistrationUuid(
      {
        registrationUuid
      }
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
  }) => {
    try {
      return db.transaction(async transaction => {
        const {
          currentStep
        } = await enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
          {
            registrationUuid,
            transaction
          }
        );
        if (currentStep !== 1) {
          throw new CustomError('当前步骤不允许保存评测合同信息!');
        } else {
          const postalCodeReg = /^\d{6}$/;
          if (!(amount >= 1 && amount <= 999)) {
            throw new CustomError('数量不符合规则!');
          }
          if (fax?.length > 32) {
            throw new CustomError('传真长度不符合规则!');
          }
          if (!postalCodeReg.test(postalCode)) {
            throw new CustomError('邮政编码不符合规则!');
          }
          if (!mainFunction.length || mainFunction.length > 200) {
            throw new CustomError('主要功能长度不符合规则!');
          }
          if (!techIndex.length || techIndex.length > 200) {
            throw new CustomError('技术指标长度不符合规则!');
          }
          return await enterpriseRegistrationContractDao.updateRegistrationContract(
            {
              registrationUuid,
              amount,
              fax,
              postalCode,
              mainFunction,
              techIndex,
              status: 1,
              statusText: '待审核',
              failText: '',
              transaction
            }
          );
        }
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 查询样品登记表信息
   */
  selectRegistrationSpecimenByRegistrationUuid: registrationUuid =>
    enterpriseRegistrationSpecimenDao.selectRegistrationSpecimenByRegistrationUuid(
      {
        registrationUuid
      }
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
  }) => {
    try {
      return db.transaction(async transaction => {
        const {
          currentStep
        } = await enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
          {
            registrationUuid,
            transaction
          }
        );
        if (currentStep !== 1) {
          throw new CustomError('当前步骤不允许保存样品登记表信息!');
        } else {
          if (!trademark.length || trademark.length > 32) {
            throw new CustomError('注册商标长度不符合规则!');
          }
          if (!developmentTool.length || developmentTool.length > 32) {
            throw new CustomError('开发工具长度不符合规则!');
          }
          if (!email.length || email.length > 32) {
            throw new CustomError('邮箱长度不符合规则!');
          }

          return await enterpriseRegistrationSpecimenDao.updateRegistrationSpecimen(
            {
              registrationUuid,
              trademark,
              developmentTool,
              securityClassification,
              email,
              unit,
              status: 1,
              statusText: '待审核',
              failText: '',
              transaction
            }
          );
        }
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 查询现场测试申请表的基本信息
   */
  selectRegistrationApplyByRegistrationUuid: registrationUuid =>
    enterpriseRegistrationApplyDao.selectRegistrationApplyByRegistrationUuid({
      registrationUuid
    }),

  /**
   * 保存现场测试申请表的基本信息
   */
  saveRegistrationApply: ({ registrationUuid, content }) => {
    try {
      return db.transaction(async transaction => {
        const {
          currentStep
        } = await enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
          {
            registrationUuid,
            transaction
          }
        );
        if (currentStep !== 1) {
          throw new CustomError('当前步骤不允许保存现场测试申请表信息!');
        } else {
          return await enterpriseRegistrationApplyDao.updateRegistrationApply({
            registrationUuid,
            content,
            status: 1,
            statusText: '待审核',
            failText: '',
            transaction
          });
        }
      });
    } catch (error) {
      throw error;
    }
  },
  /**
   * 获取软件著作权的信息
   */
  selectRegistrationCopyright: ({ registrationUuid }) =>
    enterpriseRegistrationCopyrightDao.selectRegistrationCopyrightByRegistrationUuid(
      {
        registrationUuid
      }
    ),

  /**
   * 保存软件著作权的信息
   */
  saveRegistrationCopyright: async ({ registrationUuid, copyrightUrl }) => {
    try {
      return db.transaction(async transaction => {
        const {
          currentStep
        } = await enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
          {
            registrationUuid,
            transaction
          }
        );
        if (currentStep !== 1) {
          throw new CustomError('当前步骤不允许保存软件著作权文件!');
        } else {
          let productionUrl = '';
          // 将temp的文件copy到production中
          const [filePosition] = copyrightUrl.split('/');

          if (filePosition === 'temp') {
            const tempUrl = copyrightUrl;
            productionUrl = copyrightUrl.replace('temp', 'production');

            const copyright = await enterpriseRegistrationCopyrightDao.selectRegistrationCopyrightByRegistrationUuid(
              {
                registrationUuid,
                transaction
              }
            );

            if (copyright?.url) {
              await client.delete(copyright.url);
            }

            await client.copy(productionUrl, tempUrl);
          } else if (filePosition === 'production') {
            productionUrl = copyrightUrl;
          } else {
            throw new CustomError('oss文件路径错误');
          }

          return await enterpriseRegistrationCopyrightDao.updateRegistrationCopyright(
            {
              registrationUuid,
              copyrightUrl: productionUrl,
              status: 1,
              statusText: '待审核',
              failText: '',
              transaction
            }
          );
        }
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 获取用户文档集的信息
   */
  selectRegistrationDocument: ({ registrationUuid }) =>
    enterpriseRegistrationDocumentDao.selectRegistrationDocumentByRegistrationUuid(
      { registrationUuid }
    ),

  /**
   * 保存用户文档集的信息
   */
  saveRegistrationDocument: async ({ registrationUuid, documentUrl }) => {
    try {
      return db.transaction(async transaction => {
        const {
          currentStep
        } = await enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
          {
            registrationUuid,
            transaction
          }
        );
        if (currentStep !== 1) {
          throw new CustomError('当前步骤不允许保存用户文档集文件!');
        } else {
          let productionUrl = '';
          // 将temp的文件copy到production中
          const [filePosition] = documentUrl.split('/');

          if (filePosition === 'temp') {
            const tempUrl = documentUrl;
            productionUrl = documentUrl.replace('temp', 'production');

            const document = await enterpriseRegistrationDocumentDao.selectRegistrationDocumentByRegistrationUuid(
              { registrationUuid, transaction }
            );

            if (document?.url) {
              await client.delete(document.url);
            }

            await client.copy(productionUrl, tempUrl);
          } else if (filePosition === 'production') {
            productionUrl = documentUrl;
          } else {
            throw new CustomError('oss文件路径错误');
          }

          return await enterpriseRegistrationDocumentDao.updateRegistrationDocument(
            {
              registrationUuid,
              documentUrl: productionUrl,
              status: 1,
              statusText: '待审核',
              failText: '',
              transaction
            }
          );
        }
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 获取产品说明的信息
   */
  selectRegistrationProductDescription: ({ registrationUuid }) =>
    enterpriseRegistrationProductDescriptionDao.selectRegistrationProductDescriptionByRegistrationUuid(
      { registrationUuid }
    ),

  /**
   * 保存产品说明的信息
   */
  saveRegistrationProductDescription: async ({
    registrationUuid,
    productDescriptionUrl
  }) => {
    try {
      return db.transaction(async transaction => {
        const {
          currentStep
        } = await enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
          {
            registrationUuid,
            transaction
          }
        );
        if (currentStep !== 1) {
          throw new CustomError('当前步骤不允许保存产品说明文件!');
        } else {
          let productionUrl = '';
          // 将temp的文件copy到production中
          const [filePosition] = productDescriptionUrl.split('/');

          if (filePosition === 'temp') {
            const tempUrl = productDescriptionUrl;
            productionUrl = productDescriptionUrl.replace('temp', 'production');
            const productDescription = await enterpriseRegistrationProductDescriptionDao.selectRegistrationProductDescriptionByRegistrationUuid(
              { registrationUuid, transaction }
            );

            if (productDescription?.url) {
              await client.delete(productDescription.url);
            }

            await client.copy(productionUrl, tempUrl);
          } else if (filePosition === 'production') {
            productionUrl = productDescriptionUrl;
          } else {
            throw new CustomError('oss文件路径错误');
          }

          return await enterpriseRegistrationProductDescriptionDao.updateRegistrationProductDescription(
            {
              registrationUuid,
              productDescriptionUrl: productionUrl,
              status: 1,
              statusText: '待审核',
              failText: '',
              transaction
            }
          );
        }
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 获取产品介质的信息
   */
  selectRegistrationProduct: ({ registrationUuid }) =>
    enterpriseRegistrationProductDao.selectRegistrationProductByRegistrationUuid(
      { registrationUuid }
    ),

  /**
   * 保存产品介质的信息
   */
  saveRegistrationProduct: async ({ registrationUuid, productUrl }) => {
    try {
      return db.transaction(async transaction => {
        const {
          currentStep
        } = await enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
          {
            registrationUuid,
            transaction
          }
        );
        if (currentStep !== 1) {
          throw new CustomError('当前步骤不允许保存产品说明文件!');
        } else {
          let productionUrl = '';
          // 将temp的文件copy到production中
          const [filePosition] = productUrl.split('/');

          if (filePosition === 'temp') {
            const tempUrl = productUrl;
            productionUrl = productUrl.replace('temp', 'production');
            const product = await enterpriseRegistrationProductDao.selectRegistrationProductByRegistrationUuid(
              { registrationUuid, transaction }
            );

            if (product?.url) {
              await client.delete(product.url);
            }

            await client.copy(productionUrl, tempUrl);
          } else if (filePosition === 'production') {
            productionUrl = productUrl;
          } else {
            throw new CustomError('oss文件路径错误');
          }

          return await enterpriseRegistrationProductDao.updateRegistrationProduct(
            {
              registrationUuid,
              productUrl: productionUrl,
              status: 1,
              statusText: '待审核',
              failText: '',
              transaction
            }
          );
        }
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
      return db.transaction(async transaction => {
        const {
          currentStep
        } = await enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
          {
            registrationUuid,
            transaction
          }
        );
        if (currentStep !== 1) {
          throw new CustomError('当前步骤不允许设置审核通过状态!');
        } else {
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
            if (!statusDao[type]) throw new CustomError('错误类型');

            return statusDao[type];
          };

          if (failText?.length > 100) {
            throw new CustomError('审核不通过理由文本长度不符合规则!');
          }

          if (isPass) {
            await getStatusDao(type)({
              registrationUuid,
              status: 100,
              failText,
              statusText: '已审核',
              transaction
            });

            return await _finishSubmitFile({
              registrationUuid,
              transaction
            });
          } else {
            return await getStatusDao(type)({
              registrationUuid,
              status: -1,
              failText,
              statusText: '内容错误',
              transaction
            });
          }
        }
      });
    } catch (error) {
      throw error;
    }
  }
};
