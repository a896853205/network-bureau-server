import { db } from '../../../db/db-connect';

// oss
import client from '../../../util/oss';

// dao
import enterpriseDelegationBasicDao from '../../../dao/enterprise/enterprise-delegation-basic-dao';
import enterpriseDelegationContractDao from '../../../dao/enterprise/enterprise-delegation-contract-dao';
import enterpriseDelegationSpecimenDao from '../../../dao/enterprise/enterprise-delegation-specimen-dao';
import enterpriseDelegationApplyDao from '../../../dao/enterprise/enterprise-delegation-apply-dao';
import enterpriseDelegationCopyrightDao from '../../../dao/enterprise/enterprise-delegation-copyright-dao';
import enterpriseDelegationDocumentDao from '../../../dao/enterprise/enterprise-delegation-document-dao';
import enterpriseDelegationProductDescriptionDao from '../../../dao/enterprise/enterprise-delegation-product-description-dao';
import enterpriseDelegationProductDao from '../../../dao/enterprise/enterprise-delegation-product-dao';
import enterpriseDelegationStepDao from '../../../dao/enterprise/enterprise-delegation-step-dao';
import enterpriseDelegationDao from '../../../dao/enterprise/enterprise-delegation-dao';

// 工具类
import CustomError from '../../../util/custom-error';

const _finishDelegationSubmitFile = async ({ delegationUuid, transaction }) => {
  const [
    enterpriseDelegationBasicStatus,
    enterpriseDelegationContractStatus,
    enterpriseDelegationCopyrightStatus,
    enterpriseDelegationSpecimenStatus,
    enterpriseDelegationProductDescriptionStatus,
    enterpriseDelegationDocumentStatus,
    enterpriseDelegationProductStatus,
    enterpriseDelegationApplyStatus,
  ] = await Promise.all([
    enterpriseDelegationBasicDao.selectDelegationBasicByDelegationUuid({
      delegationUuid,
      transaction,
    }),
    enterpriseDelegationContractDao.selectDelegationContractByDelegationUuid(
      {
        delegationUuid,
        transaction,
      }
    ),
    enterpriseDelegationCopyrightDao.selectDelegationCopyrightByDelegationUuid(
      {
        delegationUuid,
        transaction,
      }
    ),
    enterpriseDelegationSpecimenDao.selectDelegationSpecimenByDelegationUuid(
      {
        delegationUuid,
        transaction,
      }
    ),
    enterpriseDelegationProductDescriptionDao.selectDelegationProductDescriptionByDelegationUuid(
      {
        delegationUuid,
        transaction,
      }
    ),
    enterpriseDelegationDocumentDao.selectDelegationDocumentByDelegationUuid(
      {
        delegationUuid,
        transaction,
      }
    ),
    enterpriseDelegationProductDao.selectDelegationProductByDelegationUuid(
      {
        delegationUuid,
        transaction,
      }
    ),
    enterpriseDelegationApplyDao.selectDelegationApplyByDelegationUuid({
      delegationUuid,
      transaction,
    }),
  ]);

  if (
    enterpriseDelegationBasicStatus.status === 100 &&
    enterpriseDelegationContractStatus.status === 100 &&
    enterpriseDelegationCopyrightStatus.status === 100 &&
    enterpriseDelegationSpecimenStatus.status === 100 &&
    enterpriseDelegationProductDescriptionStatus.status === 100 &&
    enterpriseDelegationDocumentStatus.status === 100 &&
    enterpriseDelegationProductStatus.status === 100 &&
    enterpriseDelegationApplyStatus.status === 100
  ) {
    // 改进度和steps表
    await Promise.all([
      enterpriseDelegationDao.updateDelegationCurrentStep({
        delegationUuid,
        currentStep: 2,
        transaction,
      }),
      enterpriseDelegationStepDao.updateDelegationStep({
        delegationUuid,
        status: 100,
        statusText: '已完成',
        step: 1,
        transaction,
      }),
      enterpriseDelegationStepDao.updateDelegationStep({
        delegationUuid,
        status: 1,
        statusText: '管理员填写内容',
        step: 2,
        transaction,
      }),
    ]);
  }
};

export default {
  /**
   * 查询企业用户登记测试八个状态通过uuid
   */
  selectDelegationStatusByDelegationUuid: async (delegationUuid) => {
    try {
      const [
        enterpriseDelegationBasicStatus,
        enterpriseDelegationContractStatus,
        enterpriseDelegationCopyrightStatus,
        enterpriseDelegationSpecimenStatus,
        enterpriseDelegationProductDescriptionStatus,
        enterpriseDelegationDocumentStatus,
        enterpriseDelegationProductStatus,
        enterpriseDelegationApplyStatus,
      ] = await Promise.all([
        enterpriseDelegationBasicDao.selectDelegationBasicByDelegationUuid(
          {
            delegationUuid,
          }
        ),
        enterpriseDelegationContractDao.selectDelegationContractByDelegationUuid(
          {
            delegationUuid,
          }
        ),
        enterpriseDelegationCopyrightDao.selectDelegationCopyrightByDelegationUuid(
          {
            delegationUuid,
          }
        ),
        enterpriseDelegationSpecimenDao.selectDelegationSpecimenByDelegationUuid(
          { delegationUuid }
        ),
        enterpriseDelegationProductDescriptionDao.selectDelegationProductDescriptionByDelegationUuid(
          { delegationUuid }
        ),
        enterpriseDelegationDocumentDao.selectDelegationDocumentByDelegationUuid(
          { delegationUuid }
        ),
        enterpriseDelegationProductDao.selectDelegationProductByDelegationUuid(
          { delegationUuid }
        ),
        enterpriseDelegationApplyDao.selectDelegationApplyByDelegationUuid(
          { delegationUuid }
        ),
      ]);

      return {
        enterpriseDelegationBasicStatus,
        enterpriseDelegationContractStatus,
        enterpriseDelegationCopyrightStatus,
        enterpriseDelegationSpecimenStatus,
        enterpriseDelegationProductDescriptionStatus,
        enterpriseDelegationDocumentStatus,
        enterpriseDelegationProductStatus,
        enterpriseDelegationApplyStatus,
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * 查询登记测试的基本信息
   */
  selectDelegationBasicByDelegationUuid: (delegationUuid) =>
    enterpriseDelegationBasicDao.selectDelegationBasicByDelegationUuid({
      delegationUuid,
    }),

  /**
   * 保存登记测试的基本信息
   */
  saveDelegationBasic: ({
    delegationUuid,
    version,
    linkman,
    client,
    phone,
    address,
    devStartTime,
    enterpriseName,
  }) => {
    try {
      const phoneReg = /^([1])(\d){10}$/,
        versionReg = /^(\d{1,2})(.([1-9]\d|\d)){1,2}$/;

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

      if (client !== enterpriseName) {
        throw new CustomError('开发单位和委托单位应一致!');
      }

      return db.transaction(async (transaction) => {
        const {
          currentStep,
        } = await enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
          {
            delegationUuid,
            transaction,
          }
        );
        if (!currentStep === 1) {
          throw new CustomError('当前步骤不允许保存基本信息!');
        } else {
          return await enterpriseDelegationBasicDao.updateDelegationBasic({
            delegationUuid,
            version,
            linkman,
            client,
            phone,
            address,
            devStartTime,
            enterpriseName,
            status: 1,
            statusText: '已填写',
            failText: '',
            transaction,
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
  selectDelegationContractByDelegationUuid: (delegationUuid) =>
    enterpriseDelegationContractDao.selectDelegationContractByDelegationUuid(
      {
        delegationUuid,
      }
    ),

  /**
   * 保存评测合同的基本信息
   */
  saveDelegationContract: ({
    delegationUuid,
    amount,
    postalCode,
    mainFunction,
    techIndex,
  }) => {
    try {
      return db.transaction(async (transaction) => {
        const {
          currentStep,
        } = await enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
          {
            delegationUuid,
            transaction,
          }
        );
        if (currentStep !== 1) {
          throw new CustomError('当前步骤不允许保存评测合同信息!');
        } else {
          const postalCodeReg = /^\d{6}$/;
          if (!(amount >= 1 && amount <= 999)) {
            throw new CustomError('数量不符合规则!');
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
          return await enterpriseDelegationContractDao.updateDelegationContract(
            {
              delegationUuid,
              amount,
              postalCode,
              mainFunction,
              techIndex,
              status: 1,
              statusText: '已填写',
              failText: '',
              transaction,
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
  selectDelegationSpecimenByDelegationUuid: (delegationUuid) =>
    enterpriseDelegationSpecimenDao.selectDelegationSpecimenByDelegationUuid(
      {
        delegationUuid,
      }
    ),

  /**
   * 保存样品登记表信息
   */
  saveDelegationSpecimen: ({
    delegationUuid,
    trademark,
    developmentTool,
    securityClassification,
    email,
    unit,
  }) => {
    try {
      return db.transaction(async (transaction) => {
        const {
          currentStep,
        } = await enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
          {
            delegationUuid,
            transaction,
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

          return await enterpriseDelegationSpecimenDao.updateDelegationSpecimen(
            {
              delegationUuid,
              trademark,
              developmentTool,
              securityClassification,
              email,
              unit,
              status: 1,
              statusText: '已填写',
              failText: '',
              transaction,
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
  selectDelegationApplyByDelegationUuid: (delegationUuid) =>
    enterpriseDelegationApplyDao.selectDelegationApplyByDelegationUuid({
      delegationUuid,
    }),

  /**
   * 保存现场测试申请表的基本信息
   */
  saveDelegationApply: ({ delegationUuid, content }) => {
    try {
      return db.transaction(async (transaction) => {
        const {
          currentStep,
        } = await enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
          {
            delegationUuid,
            transaction,
          }
        );
        if (currentStep !== 1) {
          throw new CustomError('当前步骤不允许保存现场测试申请表信息!');
        } else {
          return await enterpriseDelegationApplyDao.updateDelegationApply({
            delegationUuid,
            content,
            status: 1,
            statusText: '已填写',
            failText: '',
            transaction,
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
  selectDelegationCopyright: ({ delegationUuid }) =>
    enterpriseDelegationCopyrightDao.selectDelegationCopyrightByDelegationUuid(
      {
        delegationUuid,
      }
    ),

  /**
   * 保存软件著作权的信息
   */
  saveDelegationCopyright: async ({ delegationUuid, copyrightUrl }) => {
    try {
      return db.transaction(async (transaction) => {
        const {
          currentStep,
        } = await enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
          {
            delegationUuid,
            transaction,
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

            const copyright = await enterpriseDelegationCopyrightDao.selectDelegationCopyrightByDelegationUuid(
              {
                delegationUuid,
                transaction,
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

          return await enterpriseDelegationCopyrightDao.updateDelegationCopyright(
            {
              delegationUuid,
              copyrightUrl: productionUrl,
              status: 1,
              statusText: '已上传',
              failText: '',
              transaction,
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
  selectDelegationDocument: ({ delegationUuid }) =>
    enterpriseDelegationDocumentDao.selectDelegationDocumentByDelegationUuid(
      { delegationUuid }
    ),

  /**
   * 保存用户文档集的信息
   */
  saveDelegationDocument: async ({ delegationUuid, documentUrl }) => {
    try {
      return db.transaction(async (transaction) => {
        const {
          currentStep,
        } = await enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
          {
            delegationUuid,
            transaction,
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

            const document = await enterpriseDelegationDocumentDao.selectDelegationDocumentByDelegationUuid(
              { delegationUuid, transaction }
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

          return await enterpriseDelegationDocumentDao.updateDelegationDocument(
            {
              delegationUuid,
              documentUrl: productionUrl,
              status: 1,
              statusText: '已上传',
              failText: '',
              transaction,
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
  selectDelegationProductDescription: ({ delegationUuid }) =>
    enterpriseDelegationProductDescriptionDao.selectDelegationProductDescriptionByDelegationUuid(
      { delegationUuid }
    ),

  /**
   * 保存产品说明的信息
   */
  saveDelegationProductDescription: async ({
    delegationUuid,
    productDescriptionUrl,
  }) => {
    try {
      return db.transaction(async (transaction) => {
        const {
          currentStep,
        } = await enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
          {
            delegationUuid,
            transaction,
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
            const productDescription = await enterpriseDelegationProductDescriptionDao.selectDelegationProductDescriptionByDelegationUuid(
              { delegationUuid, transaction }
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

          return await enterpriseDelegationProductDescriptionDao.updateDelegationProductDescription(
            {
              delegationUuid,
              productDescriptionUrl: productionUrl,
              status: 1,
              statusText: '已上传',
              failText: '',
              transaction,
            }
          );
        }
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 获取样品的信息
   */
  selectDelegationProduct: ({ delegationUuid }) =>
    enterpriseDelegationProductDao.selectDelegationProductByDelegationUuid(
      { delegationUuid }
    ),

  /**
   * 保存样品的信息
   */
  saveDelegationProduct: async ({ delegationUuid, productUrl }) => {
    try {
      return db.transaction(async (transaction) => {
        const {
          currentStep,
        } = await enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
          {
            delegationUuid,
            transaction,
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
            const product = await enterpriseDelegationProductDao.selectDelegationProductByDelegationUuid(
              { delegationUuid, transaction }
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

          return await enterpriseDelegationProductDao.updateDelegationProduct(
            {
              delegationUuid,
              productUrl: productionUrl,
              status: 1,
              statusText: '已上传',
              failText: '',
              transaction,
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
  setDelegationDetailStatus: async ({
    delegationUuid,
    type,
    failText,
    isPass,
  }) => {
    try {
      return db.transaction(async (transaction) => {
        const {
          currentStep,
        } = await enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
          {
            delegationUuid,
            transaction,
          }
        );
        if (currentStep !== 1) {
          throw new CustomError('当前步骤不允许设置审核通过状态!');
        } else {
          const statusDao = {
            basic: enterpriseDelegationBasicDao.updateBasicStatus,
            contract: enterpriseDelegationContractDao.updateContractStatus,
            product: enterpriseDelegationProductDao.updateProductStatus,
            productDescription:
              enterpriseDelegationProductDescriptionDao.updateProductDescriptionStatus,
            apply: enterpriseDelegationApplyDao.updateApplyStatus,
            copyright: enterpriseDelegationCopyrightDao.updateCopyrightStatus,
            document: enterpriseDelegationDocumentDao.updateDocumentStatus,
            specimen: enterpriseDelegationSpecimenDao.updateSpecimenStatus,
          };

          const getStatusDao = (type) => {
            if (!statusDao[type]) throw new CustomError('错误类型');

            return statusDao[type];
          };

          if (failText?.length > 100) {
            throw new CustomError('审核不通过理由文本长度不符合规则!');
          }

          if (isPass) {
            await getStatusDao(type)({
              delegationUuid,
              status: 100,
              failText,
              statusText: '已审核',
              transaction,
            });

            return await _finishDelegationSubmitFile({
              delegationUuid,
              transaction,
            });
          } else {
            return await getStatusDao(type)({
              delegationUuid,
              status: -1,
              failText,
              statusText: '内容错误',
              transaction,
            });
          }
        }
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 企业点击提交8种信息
   */
  submitDelegationAllFile: async ({ delegationUuid }) => {
    try {
      return db.transaction(async (transaction) => {
        const [
          { status: basicStatus },
          { status: contractStatus },
          { status: specimenStatus },
          { status: applyStatus },
          { status: copyrightStatus },
          { status: documentStatus },
          { status: productDescriptionStatus },
          { status: productStatus },
        ] = await Promise.all([
          enterpriseDelegationBasicDao.selectDelegationBasicStatusByDelegationUuid(
            {
              delegationUuid,
              transaction,
            }
          ),
          enterpriseDelegationContractDao.selectDelegationContractStatusByDelegationUuid(
            {
              delegationUuid,
              transaction,
            }
          ),
          enterpriseDelegationSpecimenDao.selectDelegationSpecimenStatusByDelegationUuid(
            {
              delegationUuid,
              transaction,
            }
          ),
          enterpriseDelegationApplyDao.selectDelegationApplyStatusByDelegationUuid(
            {
              delegationUuid,
              transaction,
            }
          ),
          enterpriseDelegationCopyrightDao.selectDelegationCopyrightStatusByDelegationUuid(
            {
              delegationUuid,
              transaction,
            }
          ),
          enterpriseDelegationDocumentDao.selectDelegationDocumentStatusByDelegationUuid(
            {
              delegationUuid,
              transaction,
            }
          ),
          enterpriseDelegationProductDescriptionDao.selectDelegationProductDescriptionStatusByDelegationUuid(
            {
              delegationUuid,
              transaction,
            }
          ),
          enterpriseDelegationProductDao.selectDelegationProductStatusByDelegationUuid(
            {
              delegationUuid,
              transaction,
            }
          ),
        ]);

        if (
          basicStatus !== 0 &&
          basicStatus !== 3 &&
          contractStatus !== 0 &&
          contractStatus !== 3 &&
          specimenStatus !== 0 &&
          specimenStatus !== 3 &&
          applyStatus !== 0 &&
          applyStatus !== 3 &&
          copyrightStatus !== 0 &&
          copyrightStatus !== 3 &&
          documentStatus !== 0 &&
          documentStatus !== 3 &&
          productDescriptionStatus !== 0 &&
          productDescriptionStatus !== 3 &&
          productStatus !== 0 &&
          productStatus !== 3
        ) {
          if (basicStatus === 1) {
            enterpriseDelegationBasicDao.updateDelegationBasicStatus({
              delegationUuid,
              status: 2,
              statusText: '待审核',
              transaction,
            });
          }
          if (contractStatus === 1) {
            enterpriseDelegationContractDao.updateDelegationContractStatus({
              delegationUuid,
              status: 2,
              statusText: '待审核',
              transaction,
            });
          }
          if (specimenStatus === 1) {
            enterpriseDelegationSpecimenDao.updateDelegationSpecimenStatus({
              delegationUuid,
              status: 2,
              statusText: '待审核',
              transaction,
            });
          }
          if (applyStatus === 1) {
            enterpriseDelegationApplyDao.updateDelegationApplyStatus({
              delegationUuid,
              status: 2,
              statusText: '待审核',
              transaction,
            });
          }
          if (copyrightStatus === 1) {
            enterpriseDelegationCopyrightDao.updateDelegationCopyrightStatus({
              delegationUuid,
              status: 2,
              statusText: '待审核',
              transaction,
            });
          }
          if (documentStatus === 1) {
            enterpriseDelegationDocumentDao.updateDelegationDocumentStatus({
              delegationUuid,
              status: 2,
              statusText: '待审核',
              transaction,
            });
          }
          if (productDescriptionStatus === 1) {
            enterpriseDelegationProductDescriptionDao.updateDelegationProductDescriptionStatus({
              delegationUuid,
              status: 2,
              statusText: '待审核',
              transaction,
            });
          }
          if (productStatus === 1) {
            enterpriseDelegationProductDao.updateDelegationProductStatus({
              delegationUuid,
              status: 2,
              statusText: '待审核',
              transaction,
            });
          }
          return await enterpriseDelegationStepDao.updateDelegationDelegationStep({
            delegationUuid,
            status: 2,
            statusText: '企业已提交',
            step: 1,
            transaction,
          });
        } else {
          throw new CustomError('请确认全部填写或修改完毕再提交!');
        }
      });
    } catch (error) {
      throw error;
    }
  },
};
