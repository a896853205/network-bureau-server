// dao
import enterpriseRegistrationDao from '../../dao/enterprise/enterprise-registration-dao';
import enterpriseRegistrationApplyDao from '../../dao/enterprise/enterprise-registration-apply-dao';
import enterpriseRegistrationBasicDao from '../../dao/enterprise/enterprise-registration-basic-dao';
import enterpriseRegistrationContractDao from '../../dao/enterprise/enterprise-registration-contract-dao';
import enterpriseRegistrationCopyrightDao from '../../dao/enterprise/enterprise-registration-copyright-dao';
import enterpriseRegistrationDocumentDao from '../../dao/enterprise/enterprise-registration-document-dao';
import enterpriseRegistrationProductDao from '../../dao/enterprise/enterprise-registration-product-dao';
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
      let projectManagerUuid = '';

      if (projectManager && projectManager.uuid) {
        projectManagerUuid = projectManager.uuid;
      }

      return await enterpriseRegistrationDao.createEnterpriseRegistration(
        name,
        enterpriseUuid,
        projectManagerUuid
      );
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
    return await enterpriseRegistrationDao.queryEnterpriseRegistrationStepByRegistrationUuid(
      registrationUuid
    );
  },

  /**
   *  无参数查询sys_registration_step表
   */
  querySysRegistrationStep: async () => {
    return await enterpriseRegistrationDao.querySysRegistrationStep();
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
    return await enterpriseRegistrationBasicDao.saveRegistrationBasic({
      registrationUuid,
      version,
      linkman,
      client,
      phone,
      address,
      devStartTime,
      enterpriseName,
      status: 2,
      statusText: '待审核',
      failText: ''
    });
  },

  /**
   * 查询评测合同的基本信息
   */
  selectRegistrationContractByRegistrationUuid: async registrationUuid => {
    return await enterpriseRegistrationDao.selectRegistrationContractByRegistrationUuid(
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
    return await enterpriseRegistrationDao.saveRegistrationContract({
      registrationUuid,
      amount,
      fax,
      postalCode,
      mainFunction,
      techIndex,
      status: 2,
      statusText: '待审核',
      failText: ''
    });
  },

  /**
   * 查询样品登记表的基本信息
   */
  selectRegistrationSpecimenByRegistrationUuid: async registrationUuid => {
    return await enterpriseRegistrationDao.selectRegistrationSpecimenByRegistrationUuid(
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
    return await enterpriseRegistrationDao.saveRegistrationSpecimen({
      registrationUuid,
      trademark,
      developmentTool,
      securityClassification,
      email,
      unit,
      status: 2,
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
    return await enterpriseRegistrationApplyDao.saveRegistrationApply({
      registrationUuid,
      content,
      status: 2,
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

      if (copyright && copyright.url) {
        await client.delete(copyright.url);
      }

      await client.copy(productionUrl, tempUrl);
    } catch (error) {
      console.log(error);
      return false;
    }

    return await enterpriseRegistrationCopyrightDao.saveRegistrationCopyright({
      registrationUuid,
      copyrightUrl: productionUrl,
      status: 2,
      statusText: '待审核',
      failText: ''
    });
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

    return await enterpriseRegistrationDocumentDao.saveRegistrationDocument({
      registrationUuid,
      documentUrl: productionUrl,
      status: 2,
      statusText: '待审核',
      failText: ''
    });
  },

  /**
   * 获取产品说明的信息
   */
  selectRegistrationProductDescription: async ({ registrationUuid }) => {
    return await enterpriseRegistrationDao.selectRegistrationProductDescriptionByRegistrationUuid(
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
      const productDescription = await enterpriseRegistrationDao.selectRegistrationProductDescriptionByRegistrationUuid(
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

    return await enterpriseRegistrationDao.saveRegistrationProductDescription({
      registrationUuid,
      productDescriptionUrl: productionUrl,
      status: 2,
      statusText: '待审核',
      failText: ''
    });
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
      const product = await enterpriseRegistrationDao.selectRegistrationProductByRegistrationUuid(
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
    return await enterpriseRegistrationProductDao.saveRegistrationProduct({
      registrationUuid,
      productUrl: productionUrl,
      status: 2,
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
   * 设置登记测试第一步8个信息的状态
   */
  setRegistrationDetailStatus: async ({
    registrationUuid,
    type,
    status,
    failText
  }) => {
    const statusDao = {
      basic: enterpriseRegistrationBasicDao.setBasicStatus,
      contract: enterpriseRegistrationDao.setContractStatus,
      product: enterpriseRegistrationProductDao.setProductStatus,
      productDescription: enterpriseRegistrationDao.setProductDescriptionStatus,
      apply: enterpriseRegistrationApplyDao.setApplyStatus,
      copyright: enterpriseRegistrationCopyrightDao.setCopyrightStatus,
      document: enterpriseRegistrationDocumentDao.setDocumentStatus,
      specimen: enterpriseRegistrationDao.setSpecimenStatus
    };

    const getStatusDao = type => {
      if (!statusDao[type]) throw new Error('错误类型');

      return statusDao[type];
    };

    return await getStatusDao(type)({
      registrationUuid,
      status,
      failText,
      statusText: status === 4 ? '内容错误' : '已审核'
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
          enterpriseRegistrationBasicStatus.status === 3 &&
          enterpriseRegistrationContractStatus.status === 3 &&
          enterpriseRegistrationCopyrightStatus.status === 3 &&
          enterpriseRegistrationSpecimenStatus.status === 3 &&
          enterpriseRegistrationProductDescriptionStatus.status === 3 &&
          enterpriseRegistrationDocumentStatus.status === 3 &&
          enterpriseRegistrationProductStatus.status === 3 &&
          enterpriseRegistrationApplyStatus.status === 3
        ) {
          // 改进度和steps表
          await Promise.all([
            enterpriseRegistrationDao.updateRegistrationCurrentStep({
              registrationUuid,
              currentStep: 2
            }),
            enterpriseRegistrationDao.updateRegistrationStep({
              registrationUuid,
              status: 3,
              statusText: '已完成',
              step: 1
            }),
            enterpriseRegistrationDao.updateRegistrationStep({
              registrationUuid,
              status: 2,
              statusText: '正在进行',
              step: 2
            }),
            enterpriseRegistrationContractDao.saveRegistrationContractManager({
              registrationUuid,
              managerStatus: 1
            })
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
          // 改进度和steps表
          await Promise.all([
            enterpriseRegistrationDao.updateRegistrationCurrentStep({
              registrationUuid,
              currentStep: 3
            }),
            enterpriseRegistrationDao.updateRegistrationStep({
              registrationUuid,
              status: 3,
              statusText: '已完成',
              step: 2
            }),
            enterpriseRegistrationDao.updateRegistrationStep({
              registrationUuid,
              status: 2,
              statusText: '正在进行',
              step: 3
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
        enterpriseRegistrationDao.selectRegistrationContractByRegistrationUuid(
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
    return await enterpriseRegistrationContractDao.saveRegistrationContractManager(
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

    return await enterpriseRegistrationContractDao.saveManagerContractUrl({
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

    return await enterpriseRegistrationContractDao.saveEnterpriseContractUrl({
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
    failText
  }) => {
    return await enterpriseRegistrationContractDao.setContractManagerStatus({
      registrationUuid,
      managerStatus,
      failText
    });
  },

  selectContractManagerStatus: async registrationUuid => {
    return await enterpriseRegistrationContractDao.selectContractManagerStatus({
      registrationUuid
    });
  }
};
