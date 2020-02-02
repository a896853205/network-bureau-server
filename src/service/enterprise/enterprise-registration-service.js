import enterpriseRegistrationDao from '../../dao/enterprise/enterprise-registration-dao';
import managerUserDao from '../../dao/manager/manager-user-dao';

// oss
import client from '../../util/oss';

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
    return await enterpriseRegistrationDao.selectRegistrationBasicByRegistrationUuid(
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
    return await enterpriseRegistrationDao.saveRegistrationBasic({
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
    return await enterpriseRegistrationDao.selectRegistrationApplyByRegistrationUuid(
      registrationUuid
    );
  },

  /**
   * 保存现场测试申请表的基本信息
   */
  saveRegistrationApply: async ({ registrationUuid, content }) => {
    return await enterpriseRegistrationDao.saveRegistrationApply({
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
  getRegistrationCopyright: async ({ registrationUuid }) => {
    return await enterpriseRegistrationDao.selectRegistrationCopyrightByRegistrationUuid(
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
      const copyright = await enterpriseRegistrationDao.selectRegistrationCopyrightByRegistrationUuid(
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

    return await enterpriseRegistrationDao.saveRegistrationCopyright({
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
  getRegistrationDocument: async ({ registrationUuid }) => {
    return await enterpriseRegistrationDao.selectRegistrationDocumentByRegistrationUuid(
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
      const document = await enterpriseRegistrationDao.selectRegistrationDocumentByRegistrationUuid(
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

    return await enterpriseRegistrationDao.saveRegistrationDocument({
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
  getRegistrationProductDescription: async ({ registrationUuid }) => {
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
  getRegistrationProduct: async ({ registrationUuid }) => {
    return await enterpriseRegistrationDao.selectRegistrationProductByRegistrationUuid(
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
    return await enterpriseRegistrationDao.saveRegistrationProduct({
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
      basic: enterpriseRegistrationDao.setBasicStatus,
      contract: enterpriseRegistrationDao.setContractStatus,
      product: enterpriseRegistrationDao.setProductStatus,
      productDescription: enterpriseRegistrationDao.setProductDescriptionStatus,
      apply: enterpriseRegistrationDao.setApplyStatus,
      copyright: enterpriseRegistrationDao.setCopyrightStatus,
      document: enterpriseRegistrationDao.setDocumentStatus,
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
            enterpriseRegistrationDao.saveRegistrationContractManager({
              registrationUuid,
              managerStatus: 1
            })
          ]);

          return true;
        }
      }
    }

    return false;
  },

  downloadContract: async registrationUuid => {
    // 先判断statusManager是不是1
    // 再用数据库中的数据通过模板生成word
    // 等到上传盖章pdf上传完成后删除word
  },

  /**
   * 查询评测合同的基本信息
   */
  selectRegistrationContractManager: async registrationUuid => {
    return await enterpriseRegistrationDao.selectRegistrationContractManager(
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
    return await enterpriseRegistrationDao.saveRegistrationContractManager({
      registrationUuid,
      contractCode,
      specimenHaveTime,
      payment,
      paymentTime,
      contractTime,
      managerStatus: 2
    });
  }
};
