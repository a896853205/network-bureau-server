import { db } from '../../db/db-connect';

// dao
import enterpriseRegistrationDao from '../../dao/enterprise/enterprise-registration-dao';
import enterpriseRegistrationApplyDao from '../../dao/enterprise/enterprise-registration-apply-dao';
import enterpriseRegistrationBasicDao from '../../dao/enterprise/enterprise-registration-basic-dao';
import enterpriseRegistrationContractDao from '../../dao/enterprise/enterprise-registration-contract-dao';
import enterpriseRegistrationCopyrightDao from '../../dao/enterprise/enterprise-registration-copyright-dao';
import enterpriseRegistrationDocumentDao from '../../dao/enterprise/enterprise-registration-document-dao';
import enterpriseRegistrationProductDao from '../../dao/enterprise/enterprise-registration-product-dao';
import enterpriseRegistrationProductDescriptionDao from '../../dao/enterprise/enterprise-registration-product-description-dao';
import enterpriseRegistrationSpecimenDao from '../../dao/enterprise/enterprise-registration-specimen-dao';
import enterpriseRegistrationStepDao from '../../dao/enterprise/enterprise-registration-step-dao';
import sysRegistrationStepDao from '../../dao/sys/sys-registration-step-dao';
import managerUserDao from '../../dao/manager/manager-user-dao';

// oss
import client from '../../util/oss';

// 生成word
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';

// 时间
import moment from 'moment';

// service
import fileService from '../../service/user/file-service';

import uuid from 'uuid';

export default {
  /**
   * 根据名字查询
   */
  selectEnterpriseRegistrationByName: async name => {
    return await enterpriseRegistrationDao.selectEnterpriseRegistrationByName(
      name
    );
  },

  /**
   * 根据RegistrationUuid查询
   */
  selectRegistrationByRegistrationUuid: async registrationUuid => {
    return await enterpriseRegistrationDao.selectRegistrationByRegistrationUuid(
      registrationUuid
    );
  },

  /**
   * 创建登记测试
   */
  createEnterpriseRegistration: async (name, enterpriseUuid) => {
    if (
      await enterpriseRegistrationDao.selectEnterpriseRegistrationByName(name)
    ) {
      return false;
    } else {
      // 查询一个项目管理员
      const projectManager = await managerUserDao.selectManagerUserByRole(10);
      const projectManagerUuid = projectManager?.uuid;

      // 初始化步骤的数据
      const enterpriseRegistrationUuid = uuid.v1(),
        enterpriseRegistrationSteps = [
          {
            uuid: enterpriseRegistrationUuid,
            step: 1,
            status: 1,
            statusText: '正在进行',
            managerUuid: projectManagerUuid
          },
          {
            uuid: enterpriseRegistrationUuid,
            step: 2,
            status: 0,
            statusText: '未开始',
            managerUuid: projectManagerUuid
          },
          {
            uuid: enterpriseRegistrationUuid,
            step: 3,
            status: 0,
            statusText: '未开始',
            managerUuid: projectManagerUuid
          },
          {
            uuid: enterpriseRegistrationUuid,
            step: 4,
            status: 0,
            statusText: '未开始',
            managerUuid: projectManagerUuid
          },
          {
            uuid: enterpriseRegistrationUuid,
            step: 5,
            status: 0,
            statusText: '未开始',
            managerUuid: projectManagerUuid
          },
          {
            uuid: enterpriseRegistrationUuid,
            step: 6,
            status: 0,
            statusText: '未开始',
            managerUuid: projectManagerUuid
          }
        ];

      await db.transaction(async () => {
        await Promise.all([
          enterpriseRegistrationDao.insertEnterpriseRegistration(
            enterpriseRegistrationUuid,
            name,
            enterpriseUuid
          ),
          enterpriseRegistrationCopyrightDao.insertRegistrationCopyright(
            enterpriseRegistrationUuid
          ),
          enterpriseRegistrationContractDao.insertRegistrationContract(
            enterpriseRegistrationUuid
          ),
          enterpriseRegistrationSpecimenDao.insertRegistrationSpecimen(
            enterpriseRegistrationUuid
          ),
          enterpriseRegistrationProductDao.insertRegistrationProduct(
            enterpriseRegistrationUuid
          ),
          enterpriseRegistrationProductDescriptionDao.insertRegistrationProductDescription(
            enterpriseRegistrationUuid
          ),
          enterpriseRegistrationDocumentDao.insertRegistrationDocument(
            enterpriseRegistrationUuid
          ),
          enterpriseRegistrationApplyDao.insertRegistrationApply(
            enterpriseRegistrationUuid
          ),
          enterpriseRegistrationBasicDao.insertRegistrationBasic(
            enterpriseRegistrationUuid
          )
        ]);
        await enterpriseRegistrationStepDao.bulkInsertRegistrationStep(
          enterpriseRegistrationSteps
        );
      });

      return enterpriseRegistrationUuid;
    }
  },

  /**
   * 查询登记测试通过企业的uuid
   */
  queryRegistrationByEnterpriseUuid: async (enterpriseUuid, page) => {
    return await enterpriseRegistrationDao.queryRegistrationByEnterpriseUuid(
      enterpriseUuid,
      page
    );
  },

  /**
   * 查询企业用户登记测试七个状态通过uuid
   */
  selectRegistrationStatusByRegistrationUuid: async registrationUuid => {
    return await enterpriseRegistrationDao.selectRegistrationStatusByRegistrationUuid(
      registrationUuid
    );
  },

  /**
   * 查询企业用户登记测试具体的步骤状态
   */
  queryEnterpriseRegistrationStepByRegistrationUuid: async registrationUuid => {
    return await enterpriseRegistrationStepDao.queryEnterpriseRegistrationStepByRegistrationUuid(
      registrationUuid
    );
  },

  /**
   *  无参数查询sys_registration_step表
   */
  querySysRegistrationStep: async () => {
    return await sysRegistrationStepDao.querySysRegistrationStep();
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
   * 查询样品登记表的基本信息
   */
  selectRegistrationSpecimenByRegistrationUuid: async registrationUuid => {
    return await enterpriseRegistrationSpecimenDao.selectRegistrationSpecimenByRegistrationUuid(
      registrationUuid
    );
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
    // 将temp的文件copy到production中
    const tempUrl = copyrightUrl,
      productionUrl = copyrightUrl.replace('temp', 'production');

    try {
      const copyright = await enterpriseRegistrationCopyrightDao.selectRegistrationCopyrightByRegistrationUuid(
        registrationUuid
      );

      if (copyright?.url) {
        await client.delete(copyright.url);
      }

      await client.copy(productionUrl, tempUrl);
    } catch (error) {
      console.log(error);
      return false;
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
    // 将temp的文件copy到production中
    const tempUrl = documentUrl,
      productionUrl = documentUrl.replace('temp', 'production');

    try {
      const document = await enterpriseRegistrationDocumentDao.selectRegistrationDocumentByRegistrationUuid(
        registrationUuid
      );

      if (document && document.url) {
        await client.delete(document.url);
      }

      await client.copy(productionUrl, tempUrl);
    } catch (error) {
      console.log(error);
      return false;
    }

    return await enterpriseRegistrationDocumentDao.updateRegistrationDocument({
      registrationUuid,
      documentUrl: productionUrl,
      status: 1,
      statusText: '待审核',
      failText: ''
    });
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
    // 将temp的文件copy到production中
    const tempUrl = productDescriptionUrl,
      productionUrl = productDescriptionUrl.replace('temp', 'production');

    try {
      const productDescription = await enterpriseRegistrationProductDescriptionDao.selectRegistrationProductDescriptionByRegistrationUuid(
        registrationUuid
      );

      if (productDescription.url) {
        await client.delete(productDescription.url);
      }

      await client.copy(productionUrl, tempUrl);
    } catch (error) {
      console.log(error);
      return false;
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
    // 将temp的文件copy到production中
    const tempUrl = productUrl,
      productionUrl = productUrl.replace('temp', 'production');

    try {
      const product = await enterpriseRegistrationProductDao.selectRegistrationProductByRegistrationUuid(
        registrationUuid
      );

      if (product && product.url) {
        await client.delete(product.url);
      }

      await client.copy(productionUrl, tempUrl);
    } catch (error) {
      console.log(error);
      return false;
    }
    return await enterpriseRegistrationProductDao.updateRegistrationProduct({
      registrationUuid,
      productUrl: productionUrl,
      status: 1,
      statusText: '待审核',
      failText: ''
    });
  },

  /**
   * 查询登记测试
   */
  queryRegistration: async page => {
    return await enterpriseRegistrationDao.queryRegistration(page);
  },

  /**
   * 查询企业的缴费信息
   */
  queryRegistrationPayment: async ({ page, managerUuid }) => {
    const uuidList = await enterpriseRegistrationStepDao.queryRegistrationByManagerUuid(
      managerUuid
    );
    for (let item = 0; item < uuidList.length; item++) {
      uuidList[item] = uuidList[item].uuid;
    }
    return await enterpriseRegistrationDao.queryRegistrationPayment({
      page,
      uuidList
    });
  },

  /**
   * 设置登记测试第一步8个信息的状态
   */
  setRegistrationDetailStatus: async ({
    registrationUuid,
    type,
    failText
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
      status : failText ? -1 : 100,
      failText,
      statusText: failText ? '内容错误' : '已审核'
    });
  },

  /**
   * 推进登记测试的进程
   */
  pushRegistrationProcess: async registrationUuid => {
    // 先查询现在的进度,
    // 然后如果是进度1,就判断8种状态是不是都是2
    // 最后如果ok就进度改称,而且进度1的text改成已完成
    const registration = await enterpriseRegistrationDao.selectRegistrationByRegistrationUuid(
      registrationUuid
    );

    if (registration) {
      if (registration.currentStep === 1) {
        // 第一步
        const {
          enterpriseRegistrationBasicStatus,
          enterpriseRegistrationContractStatus,
          enterpriseRegistrationCopyrightStatus,
          enterpriseRegistrationSpecimenStatus,
          enterpriseRegistrationProductDescriptionStatus,
          enterpriseRegistrationDocumentStatus,
          enterpriseRegistrationProductStatus,
          enterpriseRegistrationApplyStatus
        } = await enterpriseRegistrationDao.selectRegistrationStatusByRegistrationUuid(
          registrationUuid
        );

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
              currentStep: 2
            }),
            enterpriseRegistrationStepDao.updateRegistrationStep({
              registrationUuid,
              status: 100,
              statusText: '已完成',
              step: 1
            }),
            enterpriseRegistrationStepDao.updateRegistrationStep({
              registrationUuid,
              status: 1,
              statusText: '正在进行',
              step: 2
            }),
            enterpriseRegistrationContractDao.updateRegistrationContractManager(
              {
                registrationUuid,
                managerStatus: 1
              }
            )
          ]);

          return true;
        }
      } else if (registration.currentStep === 2) {
        const contract = await enterpriseRegistrationContractDao.selectRegistrationContractManager(
          registrationUuid
        );
        // 第二步电子签合同
        if (contract.managerStatus === 5) {
          // 到了最后一步就可以
          // 下一步的人员先把自己配置上,
          // 等第三步的第一步配置上人了,企业那边才显示具体交钱信息
          // 1 是未选择财务人员
          // 2 已选择财务人员
          // 3 企业点击已交款按钮
          // 4 财务点击了确认按钮, 结束
          // 改进度和steps表
          await Promise.all([
            enterpriseRegistrationDao.updateRegistrationCurrentStep({
              registrationUuid,
              currentStep: 3
            }),
            enterpriseRegistrationStepDao.updateRegistrationStep({
              registrationUuid,
              status: 100,
              statusText: '已完成',
              step: 2
            }),
            enterpriseRegistrationStepDao.updateRegistrationStep({
              registrationUuid,
              status: 1,
              statusText: '未选择财务人员',
              step: 3
            })
          ]);

          return true;
        }
      } else if (registration.currentStep === 3) {
        const steps = await enterpriseRegistrationStepDao.queryEnterpriseRegistrationStepByRegistrationUuid(
          registrationUuid
        );

        // 财务通过之后
        if (steps[2].status === 4) {
          await Promise.all([
            enterpriseRegistrationDao.updateRegistrationCurrentStep({
              registrationUuid,
              currentStep: 4
            }),
            enterpriseRegistrationStepDao.updateRegistrationStep({
              registrationUuid,
              status: 1,
              statusText: '未选择测试管理员',
              step: 4
            })
          ]);

          return true;
        }
      }
    }

    return false;
  },

  downloadContract: async registrationUuid => {
    // 先判断statusManager是不是2
    // 再用数据库中的数据通过模板生成word
    // 等到上传盖章pdf上传完成后删除word
    const statusManager = await enterpriseRegistrationContractDao.selectRegistrationContractManager(
      registrationUuid
    );

    if (statusManager && statusManager.managerStatus >= 2) {
      // 查询contract内容
      const [
        contract,
        basic,
        registration,
        contractManager
      ] = await Promise.all([
        enterpriseRegistrationContractDao.selectRegistrationContractByRegistrationUuid(
          registrationUuid
        ),
        enterpriseRegistrationBasicDao.selectRegistrationBasicByRegistrationUuid(
          registrationUuid
        ),
        enterpriseRegistrationDao.selectRegistrationByRegistrationUuid(
          registrationUuid
        ),
        enterpriseRegistrationContractDao.selectRegistrationContractManager(
          registrationUuid
        )
      ]);

      // Load the docx file as a binary
      let content = fs.readFileSync(
        path.resolve(__dirname, '../../template/contract.docx'),
        'binary'
      );

      let zip = new PizZip(content);

      let doc = new Docxtemplater();
      doc.loadZip(zip);

      let data = {};

      Object.assign(data, contract, basic, registration, contractManager);

      // 数据整理
      if (!data.fax) {
        data.fax = '';
      }

      moment.locale('zh-cn');
      if (data.devStartTime) {
        data.devStartTime = moment(data.devStartTime).format('YYYY/MM/DD');
      }

      if (data.specimenHaveTime) {
        data.specimenHaveTime = moment(data.specimenHaveTime).format('LL');
      }

      if (data.paymentTime) {
        data.paymentTime = moment(data.paymentTime).format('LL');
      }

      if (data.contractTime) {
        data.contractTime = moment(data.contractTime).format('LL');
      }
      // 设置模板数据
      doc.setData(data);

      try {
        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render();
      } catch (error) {
        // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
        function replaceErrors(key, value) {
          if (value instanceof Error) {
            return Object.getOwnPropertyNames(value).reduce(function(
              error,
              key
            ) {
              error[key] = value[key];
              return error;
            },
            {});
          }
          return value;
        }
        console.log(JSON.stringify({ error: error }, replaceErrors));

        if (error.properties && error.properties.errors instanceof Array) {
          const errorMessages = error.properties.errors
            .map(function(error) {
              return error.properties.explanation;
            })
            .join('\n');
          console.log('errorMessages', errorMessages);
          // errorMessages is a humanly readable message looking like this :
          // 'The tag beginning with "foobar" is unopened'
        }
        throw error;
      }

      let buf = doc.getZip().generate({ type: 'nodebuffer' });

      return await fileService.uploadDownloadBufFile(buf, 'registration');
    }
    return false;
  },

  /**
   * 查询评测合同的基本信息
   */
  selectRegistrationContractManager: async registrationUuid => {
    return await enterpriseRegistrationContractDao.selectRegistrationContractManager(
      registrationUuid
    );
  },

  /**
   * 查询评测合同的路由
   */
  selectContractUrl: async registrationUuid => {
    return await enterpriseRegistrationContractDao.selectContractUrl(
      registrationUuid
    );
  },

  /**
   * 保存评测合同的基本信息
   */
  saveRegistrationContractManager: async ({
    registrationUuid,
    contractCode,
    specimenHaveTime,
    payment,
    paymentTime,
    contractTime
  }) => {
    return await enterpriseRegistrationContractDao.updateRegistrationContractManager(
      {
        registrationUuid,
        contractCode,
        specimenHaveTime,
        payment,
        paymentTime,
        contractTime,
        managerStatus: 2
      }
    );
  },

  /**
   * 保存评测合同甲方上传pdf合同的信息
   */
  saveManagerContractUrl: async ({ registrationUuid, managerUrl }) => {
    // 将temp的文件copy到production中
    const tempUrl = managerUrl,
      productionUrl = managerUrl.replace('temp', 'production');

    try {
      const contract = await enterpriseRegistrationContractDao.selectContractUrl(
        registrationUuid
      );

      if (contract && contract.managerUrl) {
        await client.delete(contract.managerUrl);
      }

      await client.copy(productionUrl, tempUrl);
    } catch (error) {
      console.log(error);
      return false;
    }

    return await enterpriseRegistrationContractDao.updateManagerContractUrl({
      registrationUuid,
      managerUrl: productionUrl,
      managerStatus: 3
    });
  },

  /**
   * 保存评测合同乙方上传pdf合同的信息
   */
  saveEnterpriseContractUrl: async ({ registrationUuid, enterpriseUrl }) => {
    // 将temp的文件copy到production中
    const tempUrl = enterpriseUrl,
      productionUrl = enterpriseUrl.replace('temp', 'production');

    try {
      const contract = await enterpriseRegistrationContractDao.selectContractUrl(
        registrationUuid
      );

      if (contract && contract.enterpriseUrl) {
        await client.delete(contract.enterpriseUrl);
      }

      await client.copy(productionUrl, tempUrl);
    } catch (error) {
      console.log(error);
      return false;
    }

    return await enterpriseRegistrationContractDao.updateEnterpriseContractUrl({
      registrationUuid,
      enterpriseUrl: productionUrl,
      managerStatus: 4,
      failText: ''
    });
  },

  /**
   * 设置第二步合同签署步骤
   */
  setContractManagerStatus: async ({
    registrationUuid,
    managerStatus,
    managerFailText
  }) => {
    return await enterpriseRegistrationContractDao.updateContractManagerStatus({
      registrationUuid,
      managerStatus,
      managerFailText
    });
  },

  /**
   * 查询第二步合同签署状态
   */
  selectContractManagerStatus: async registrationUuid => {
    return await enterpriseRegistrationContractDao.selectContractManagerStatus({
      registrationUuid
    });
  },

  /**
   * 更新财务人员信息
   */
  updateFinanceManager: async ({ registrationUuid, financeManagerUuid }) => {
    return db.transaction(() => {
      return Promise.all([
        enterpriseRegistrationStepDao.updateRegistrationStep({
          registrationUuid,
          financeManagerUuid,
          status: 2,
          statusText: '已选择财务人员',
          step: 3
        }),
        enterpriseRegistrationStepDao.updateRegistrationStepManagerUuid({
          registrationUuid,
          step: 3,
          managerUuid: financeManagerUuid
        })
      ]);
    });
  },

  /**
   * 更新支付汇款状态
   */
  noticeAccountPayment: async registrationUuid => {
    return await enterpriseRegistrationStepDao.updateRegistrationStep({
      registrationUuid,
      status: 3,
      statusText: '企业点击已交款按钮',
      step: 3
    });
  },

  /**
   * 财务确认已付款
   */
  accountantConfirmPayment: async registrationUuid => {
    return await enterpriseRegistrationStepDao.updateRegistrationStep({
      registrationUuid,
      status: 4,
      statusText: '财务已确认收款',
      step: 3
    });
  }
};
