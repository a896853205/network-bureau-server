import { db } from '../../../db/db-connect';

// dao
import enterpriseRegistrationBasicDao from '../../../dao/enterprise/enterprise-registration-basic-dao';
import enterpriseRegistrationContractDao from '../../../dao/enterprise/enterprise-registration-contract-dao';
import managerUserDao from '../../../dao/manager/manager-user-dao';
import enterpriseRegistrationDao from '../../../dao/enterprise/enterprise-registration-dao';
import enterpriseRegistrationStepDao from '../../../dao/enterprise/enterprise-registration-step-dao';
import enterpriseUserDao from '../../../dao/enterprise/enterprise-user-dao';
import enterpriseRegistrationSpecimenDao from '../../../dao/enterprise/enterprise-registration-specimen-dao';
import enterpriseRegistrationApplyDao from '../../../dao/enterprise/enterprise-registration-apply-dao';
import enterpriseRegistrationOriginalRecordDao from '../../../dao/enterprise/enterprise-registration-original-record-dao';
import enterpriseRegistrationReportDao from '../../../dao/enterprise/enterprise-registration-report-dao';

// oss
import client from '../../../util/oss';
import CustomError from '../../../util/custom-error';

// 生成word
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';

// 其他service
import fileService from '../../user/file-service';

// 时间
import moment from 'moment';

const _pushFieldTestStatus = async ({ registrationUuid, transaction }) => {
  // 查询当前步骤,
  const steps = await enterpriseRegistrationStepDao.queryEnterpriseRegistrationStepByRegistrationUuid(
    { registrationUuid, transaction }
  );

  if (steps[3].status === 3) {
    const [apply, specimen] = await Promise.all([
      enterpriseRegistrationApplyDao.selectRegistrationTestApply({
        registrationUuid,
        transaction
      }),
      enterpriseRegistrationSpecimenDao.selectRegistrationTestSpecimen({
        registrationUuid,
        transaction
      })
    ]);

    // 如果为3,就判断两个表中的managerStatus是否为100
    if (apply.managerStatus === 100 && specimen.managerStatus === 100) {
      // 如果ok就把status改为4
      await Promise.all([
        enterpriseRegistrationStepDao.updateRegistrationStep({
          registrationUuid,
          status: 4,
          statusText: '生成并审核原始报告和记录',
          step: 4,
          transaction
        }),
        enterpriseRegistrationOriginalRecordDao.updateRegistrationRecord({
          registrationUuid,
          status: 1,
          transaction
        }),
        enterpriseRegistrationReportDao.updateRegistrationReport({
          registrationUuid,
          status: 1,
          transaction
        })
      ]);
    }
  }
};

const _finishFieldTest = async ({ registrationUuid, transaction }) => {
  // 查询当前步骤,
  const steps = await enterpriseRegistrationStepDao.queryEnterpriseRegistrationStepByRegistrationUuid(
    { registrationUuid, transaction }
  );

  if (steps[3].status === 4) {
    const [record, report] = await Promise.all([
      enterpriseRegistrationOriginalRecordDao.selectManagerRegistrationRecordByRegistrationUuid(
        {
          registrationUuid,
          transaction
        }
      ),
      enterpriseRegistrationReportDao.selectManagerRegistrationReportByRegistrationUuid(
        {
          registrationUuid,
          transaction
        }
      )
    ]);

    if (record.status === 100 && report.status === 100) {
      await Promise.all([
        enterpriseRegistrationStepDao.updateRegistrationStep({
          registrationUuid,
          status: 100,
          statusText: '已完成',
          step: 4,
          transaction
        }),
        enterpriseRegistrationStepDao.updateRegistrationStep({
          registrationUuid,
          status: 100,
          statusText: '企业接受报告和原始记录',
          step: 5,
          transaction
        }),
        enterpriseRegistrationDao.updateRegistrationCurrentStep({
          registrationUuid,
          currentStep: 5,
          transaction
        })
      ]);
    }
  }
};

export default {
  /**
   * 查询技术负责人
   */
  queryTechnicalManager: page => managerUserDao.queryTechnicalManagerUser(page),

  /**
   * 查询登记测试技术人员的uuid
   */
  selectRegistrationTechManagerUuid: async registrationUuid => {
    try {
      return (
        await enterpriseRegistrationDao.selectRegistrationTechManagerUuid(
          registrationUuid
        )
      )?.techManagerUuid;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 查询登记测试技术负责人的uuid
   */
  selectRegistrationTechLeaderManagerUuid: async registrationUuid => {
    try {
      return (
        await enterpriseRegistrationDao.selectRegistrationTechLeaderManagerUuid(
          registrationUuid
        )
      )?.techLeaderManagerUuid;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 安排技术负责人
   */
  arrangeTechLeaderManager: ({ registrationUuid, technicalManagerUuid }) => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, steps] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationStepDao.queryEnterpriseRegistrationStepByRegistrationUuid(
            {
              registrationUuid,
              transaction
            }
          )
        ]);

        if (currentStep !== 4 || steps[3].status !== 1) {
          throw new CustomError('当前步骤不允许安排技术负责人!');
        }
        return await Promise.all([
          enterpriseRegistrationStepDao.updateRegistrationStep({
            registrationUuid,
            status: 2,
            statusText: '已选择技术负责人',
            step: 4,
            transaction
          }),
          enterpriseRegistrationStepDao.updateRegistrationStepManagerUuid({
            registrationUuid,
            step: 4,
            managerUuid: technicalManagerUuid,
            transaction
          }),
          enterpriseRegistrationDao.updateRegistrationTechLeaderUuid({
            registrationUuid,
            techLeaderManagerUuid: technicalManagerUuid,
            transaction
          }),
          enterpriseRegistrationApplyDao.updateApplyManagerUuid({
            registrationUuid,
            techLeaderManagerUuid: technicalManagerUuid,
            transaction
          })
        ]);
      });
    } catch (error) {
      throw error;
    }
  },
  /**
   * 查询待分配技术负责人员的企业登记测试列表
   */
  queryRegistrationNeedAssigned: async ({ page, managerUuid }) => {
    try {
      const registrationList = await enterpriseRegistrationStepDao.queryRegistrationNeedAssignedByManagerUuid(
        managerUuid
      );

      const uuidList = registrationList.map(item => item.uuid);

      return await enterpriseRegistrationDao.queryRegistrationNeedAssigned({
        page,
        uuidList
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 查询技术人员
   */
  queryTechManager: page => managerUserDao.queryTechManagerUser(page),

  /**
   * 安排技术人员
   */
  arrangeTechManager: ({ registrationUuid, techManagerUuid }) => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, steps] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationStepDao.queryEnterpriseRegistrationStepByRegistrationUuid(
            {
              registrationUuid,
              transaction
            }
          )
        ]);

        if (currentStep !== 4 || steps[3].status !== 2) {
          throw new CustomError('当前步骤不允许安排技术人员!');
        }
        return await Promise.all([
          enterpriseRegistrationStepDao.updateRegistrationStep({
            registrationUuid,
            status: 3,
            statusText: '已选择技术人员',
            step: 4,
            transaction
          }),
          enterpriseRegistrationDao.updateRegistrationTechManagerUuid({
            registrationUuid,
            techManagerUuid,
            transaction
          }),
          enterpriseRegistrationApplyDao.updateApplyManagerStatus({
            registrationUuid,
            managerStatus: 1,
            transaction
          }),
          enterpriseRegistrationApplyDao.updateApplyManagerUuid({
            registrationUuid,
            techManagerUuid,
            transaction
          }),
          enterpriseRegistrationSpecimenDao.updateSpecimenManagerStatus({
            registrationUuid,
            managerStatus: 1,
            transaction
          }),
          enterpriseRegistrationSpecimenDao.updateSpecimenManagerUuid({
            registrationUuid,
            techManagerUuid,
            transaction
          })
        ]);
      });
    } catch (error) {
      throw error;
    }
  },
  /**
   * 查询登记测试企业信息(文件审核页面)
   */
  selectEnterpriseInfoByFileDownloadRegistrationUuid: async registrationUuid => {
    try {
      const uuid = await enterpriseRegistrationDao.selectEnterpriseInfoByRegistrationUuid(
        registrationUuid
      );

      return await enterpriseUserDao.selectEnterpriseByUuid(
        uuid.enterpriseUuid
      );
    } catch (error) {
      throw error;
    }
  },

  /**
   * 根据RegistrationUuid查询5个管理员信息
   */
  selectRegistrationManagerUuid: registrationUuid =>
    enterpriseRegistrationDao.selectRegistrationByRegistrationUuid({
      registrationUuid
    }),

  /**
   * 根据RegistrationUuid查询5个管理员信息
   */
  getRegistrationManagerInfo: async registrationUuid => {
    try {
      const registrationManagerUuidList = await enterpriseRegistrationDao.selectRegistrationByRegistrationUuid(
        { registrationUuid }
      );
      let managerList = await Promise.all([
        managerUserDao.selectManagerByManagerUuidAndRole({
          managerUuid: registrationManagerUuidList.projectManagerUuid,
          role: 10
        }),
        managerUserDao.selectManagerByManagerUuidAndRole({
          managerUuid: registrationManagerUuidList.accountantManagerUuid,
          role: 5
        }),
        managerUserDao.selectManagerByManagerUuidAndRole({
          managerUuid: registrationManagerUuidList.techLeaderManagerUuid,
          role: 15
        }),
        managerUserDao.selectManagerByManagerUuidAndRole({
          managerUuid: registrationManagerUuidList.techManagerUuid,
          role: 20
        }),
        managerUserDao.selectManagerByManagerUuidAndRole({
          managerUuid: registrationManagerUuidList.certifierManagerUuid,
          role: 25
        })
      ]);

      let haveHeadPortraitUrlManagerList = managerList.filter(
          manager => manager?.headPortraitUrl
        ),
        headPreviewUrlList = await Promise.all(
          haveHeadPortraitUrlManagerList.map(manager =>
            client.signatureUrl(manager.headPortraitUrl)
          )
        );

      haveHeadPortraitUrlManagerList = haveHeadPortraitUrlManagerList.map(
        (haveHeadPortraitUrlManager, index) => {
          haveHeadPortraitUrlManager.headPreviewUrl = headPreviewUrlList[index];
          return haveHeadPortraitUrlManager;
        }
      );

      managerList = managerList.map(manager =>
        manager?.headPortraitUrl
          ? haveHeadPortraitUrlManagerList.shift()
          : manager
      );

      return {
        projectManager: managerList[0],
        accountantManager: managerList[1],
        techLeaderManager: managerList[2],
        techManager: managerList[3],
        certifierManager: managerList[4]
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * 技术人员查找注册登记信息
   */
  quaryRegistratiomNeedFieldTest: ({ page, managerUuid }) => {
    try {
      return enterpriseRegistrationDao.quaryRegistratiomNeedFieldTest({
        page,
        managerUuid
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 技术人员查询样品登记表信息
   */
  getRegistrationTestSpecimen: registrationUuid =>
    enterpriseRegistrationSpecimenDao.selectRegistrationTestSpecimen({
      registrationUuid
    }),

  /**
   * 技术人员查询现场测试申请表的基本信息
   */
  getRegistrationTestApply: registrationUuid =>
    enterpriseRegistrationApplyDao.selectRegistrationTestApply({
      registrationUuid
    }),

  /**
   * 技术人员设置现场申请表审核通过状态
   */
  setTechApplyManagerStatus: registrationUuid => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, apply] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationApplyDao.selectRegistrationApplyManagerStatus({
            registrationUuid,
            transaction
          })
        ]);

        if (currentStep !== 4 || apply.managerStatus !== 1) {
          throw new CustomError('当前步骤不允许设置现场申请表审核通过状态!');
        }
        return await enterpriseRegistrationApplyDao.updateApplyManagerStatus({
          registrationUuid,
          failManagerText: null,
          techManagerDate: new Date(),
          managerStatus: 2,
          transaction
        });
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 技术人员设置现场申请表审核不通过状态
   */
  setTechApplyManagerFailStatus: ({ registrationUuid, failManagerText }) => {
    try {
      if (!failManagerText.length || failManagerText.length > 100) {
        throw new CustomError('审核不通过理由文本长度不符合规则!');
      }
      return db.transaction(async transaction => {
        const [{ currentStep }, apply] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationApplyDao.selectRegistrationApplyManagerStatus({
            registrationUuid,
            transaction
          })
        ]);

        if (currentStep !== 4 || apply.managerStatus !== 1) {
          throw new CustomError('当前步骤不允许设置现场申请表审核通过状态!');
        }
        return await enterpriseRegistrationApplyDao.updateApplyManagerStatus({
          registrationUuid,
          failManagerText,
          managerStatus: -1,
          transaction
        });
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 技术人员设置样品登记表审核通过状态
   */
  setTechSpecimenManagerStatus: registrationUuid => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, specimen] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationSpecimenDao.selectRegistrationSpecimenManagerStatus(
            {
              registrationUuid,
              transaction
            }
          )
        ]);

        if (currentStep !== 4 || specimen.managerStatus !== 1) {
          throw new CustomError('当前步骤不允许设置样品登记表审核通过状态!');
        }
        return await enterpriseRegistrationSpecimenDao.updateSpecimenManagerStatus(
          {
            registrationUuid,
            techManagerDate: new Date(),
            failManagerText: null,
            managerStatus: 2,
            transaction
          }
        );
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 技术人员设置样品登记表审核不通过状态
   */
  setTechSpecimenManagerFailStatus: ({ registrationUuid, failManagerText }) => {
    try {
      if (!failManagerText.length || failManagerText.length > 100) {
        throw new CustomError('审核不通过理由文本长度不符合规则!');
      }
      return db.transaction(async transaction => {
        const [{ currentStep }, specimen] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationSpecimenDao.selectRegistrationSpecimenManagerStatus(
            {
              registrationUuid,
              transaction
            }
          )
        ]);

        if (currentStep !== 4 || specimen.managerStatus !== 1) {
          throw new CustomError('当前步骤不允许设置样品登记表审核通过状态!');
        }
        return await enterpriseRegistrationSpecimenDao.updateSpecimenManagerStatus(
          {
            registrationUuid,
            failManagerText,
            managerStatus: -1,
            transaction
          }
        );
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 项目管理员设置样品登记表审核通过状态
   */
  setProjectSpecimenManagerStatus: ({
    projectManagerUuid,
    registrationUuid
  }) => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, specimen] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationSpecimenDao.selectRegistrationSpecimenManagerStatus(
            {
              registrationUuid,
              transaction
            }
          )
        ]);

        if (currentStep !== 4 || specimen.managerStatus !== 2) {
          throw new CustomError('当前步骤不允许设置样品登记表审核通过状态!');
        }
        await enterpriseRegistrationSpecimenDao.updateSpecimenManagerStatus({
          registrationUuid,
          projectManagerDate: new Date(),
          projectManagerUuid,
          failManagerText: null,
          managerStatus: 100,
          transaction
        });

        return await _pushFieldTestStatus({ registrationUuid, transaction });
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 项目管理员设置样品登记表审核不通过状态
   */
  setProjectSpecimenManagerFailStatus: ({
    registrationUuid,
    failManagerText
  }) => {
    try {
      if (!failManagerText.length || failManagerText.length > 100) {
        throw new CustomError('审核不通过理由文本长度不符合规则!');
      }
      return db.transaction(async transaction => {
        const [{ currentStep }, specimen] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationSpecimenDao.selectRegistrationSpecimenManagerStatus(
            {
              registrationUuid,
              transaction
            }
          )
        ]);

        if (currentStep !== 4 || specimen.managerStatus !== 2) {
          throw new CustomError('当前步骤不允许设置样品登记表审核通过状态!');
        }
        return await enterpriseRegistrationSpecimenDao.updateSpecimenManagerStatus(
          {
            registrationUuid,
            failManagerText,
            managerStatus: -2,
            transaction
          }
        );
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 技术负责人设置现场申请表审核通过状态
   */
  setTechLeaderApplyManagerStatus: registrationUuid => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, apply] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationApplyDao.selectRegistrationApplyManagerStatus({
            registrationUuid,
            transaction
          })
        ]);

        if (currentStep !== 4 || apply.managerStatus !== 2) {
          throw new CustomError('当前步骤不允许设置现场申请表审核通过状态!');
        }
        await enterpriseRegistrationApplyDao.updateApplyManagerStatus({
          registrationUuid,
          failManagerText: null,
          techLeaderManagerDate: new Date(),
          managerStatus: 3,
          transaction
        });
      });
    } catch (error) {
      throw error;
    }
  },
  /**
   * 技术负责人设置现场申请表审核不通过状态
   */
  setTechLeaderApplyManagerFailStatus: ({
    registrationUuid,
    failManagerText
  }) => {
    try {
      if (!failManagerText.length || failManagerText.length > 100) {
        throw new CustomError('审核不通过理由文本长度不符合规则!');
      }
      return db.transaction(async transaction => {
        const [{ currentStep }, apply] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationApplyDao.selectRegistrationApplyManagerStatus({
            registrationUuid,
            transaction
          })
        ]);

        if (currentStep !== 4 || apply.managerStatus !== 2) {
          throw new CustomError('当前步骤不允许设置现场申请表审核通过状态!');
        }
        return await enterpriseRegistrationApplyDao.updateApplyManagerStatus({
          registrationUuid,
          failManagerText,
          managerStatus: -2,
          transaction
        });
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 批准人查找注册登记信息
   */
  quaryRegistratiomNeedCertified: async ({ page, certifierManagerUuid }) => {
    try {
      const registrationList = await enterpriseRegistrationStepDao.quaryCertifyRegistration();

      const uuidList = registrationList.map(item => item.uuid);

      return enterpriseRegistrationDao.quaryRegistratiomNeedCertified({
        page,
        uuidList,
        certifierManagerUuid
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 批准人设置现场申请表审核通过状态
   */
  setCertifierApplyManagerStatus: ({
    registrationUuid,
    certifierManagerUuid
  }) => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, apply] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationApplyDao.selectRegistrationApplyManagerStatus({
            registrationUuid,
            transaction
          })
        ]);

        if (currentStep !== 4 || apply.managerStatus !== 3) {
          throw new CustomError('当前步骤不允许设置现场申请表审核通过状态!');
        }
        await Promise.all([
          enterpriseRegistrationApplyDao.updateApplyManagerStatus({
            registrationUuid,
            failManagerText: null,
            certifierManagerUuid,
            certifierManagerDate: new Date(),
            managerStatus: 100,
            transaction
          }),
          enterpriseRegistrationDao.updateRegistrationCertifierManagerUuid({
            registrationUuid,
            certifierManagerUuid,
            transaction
          })
        ]);

        return await _pushFieldTestStatus({ registrationUuid, transaction });
      });
    } catch (error) {
      throw error;
    }
  },
  /**
   * 批准人设置现场申请表审核不通过状态
   */
  setCertifierApplyManagerFailStatus: ({
    registrationUuid,
    failManagerText
  }) => {
    try {
      if (!failManagerText.length || failManagerText.length > 100) {
        throw new CustomError('审核不通过理由文本长度不符合规则!');
      }
      return db.transaction(async transaction => {
        const [{ currentStep }, apply] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationApplyDao.selectRegistrationApplyManagerStatus({
            registrationUuid,
            transaction
          })
        ]);

        if (currentStep !== 4 || apply.managerStatus !== 3) {
          throw new CustomError('当前步骤不允许设置现场申请表审核通过状态!');
        }
        return await enterpriseRegistrationApplyDao.updateApplyManagerStatus({
          registrationUuid,
          failManagerText,
          managerStatus: -3,
          transaction
        });
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 企业查询样品登记表信息
   */
  selectTestRegistrationSpecimenByRegistrationUuid: registrationUuid =>
    enterpriseRegistrationSpecimenDao.selectRegistrationTestSpecimen({
      registrationUuid
    }),

  /**
   * 企业查询现场测试申请表的基本信息
   */
  selectTestRegistrationApplyByRegistrationUuid: registrationUuid =>
    enterpriseRegistrationApplyDao.selectRegistrationTestApply({
      registrationUuid
    }),

  /**
   * 企业保存样品登记表信息
   */
  saveTestRegistrationSpecimen: ({
    registrationUuid,
    trademark,
    developmentTool,
    securityClassification,
    email,
    unit
  }) => {
    if (!trademark.length || trademark.length > 32) {
      throw new CustomError('注册商标长度不符合规则!');
    }
    if (!developmentTool.length || developmentTool.length > 32) {
      throw new CustomError('开发工具长度不符合规则!');
    }
    if (!email.length || email.length > 32) {
      throw new CustomError('邮箱长度不符合规则!');
    }
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, specimen] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationSpecimenDao.selectRegistrationSpecimenManagerStatus(
            {
              registrationUuid,
              transaction
            }
          )
        ]);

        if (currentStep !== 4 || specimen.managerStatus > 0) {
          throw new CustomError('当前步骤不允许修改样品登记表!');
        }
        return await enterpriseRegistrationSpecimenDao.updateRegistrationSpecimen(
          {
            registrationUuid,
            trademark,
            developmentTool,
            securityClassification,
            email,
            unit,
            managerStatus: 1,
            failManagerText: null,
            transaction
          }
        );
      });
    } catch (error) {
      throw error;
    }
  },
  /**
   * 保存现场测试申请表的基本信息
   */
  saveTestRegistrationApply: ({ registrationUuid, content }) => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, apply] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationApplyDao.selectRegistrationApplyManagerStatus({
            registrationUuid,
            transaction
          })
        ]);

        if (currentStep !== 4 || apply.managerStatus > 0) {
          throw new CustomError('当前步骤不允许修改现场测试申请表!');
        }
        return await enterpriseRegistrationApplyDao.updateRegistrationApply({
          registrationUuid,
          content,
          managerStatus: 1,
          failManagerText: null,
          transaction
        });
      });
    } catch (error) {
      throw error;
    }
  },
  /**
   * 生成报告模板
   */
  generateReportWord: async registrationUuid => {
    const statusList = await enterpriseRegistrationStepDao.queryEnterpriseRegistrationStepByRegistrationUuid(
      { registrationUuid }
    );

    // 判断状态是否ok
    if (statusList[3].status >= 4) {
      // 根据模板生成word返回
      // 查询有关report的0内容
      const [
        contract,
        basic,
        registration,
        contractManager,
        specimen
      ] = await Promise.all([
        enterpriseRegistrationContractDao.selectRegistrationContractByRegistrationUuid(
          {
            registrationUuid
          }
        ),
        enterpriseRegistrationBasicDao.selectRegistrationBasicByRegistrationUuid(
          {
            registrationUuid
          }
        ),
        enterpriseRegistrationDao.selectRegistrationByRegistrationUuid({
          registrationUuid
        }),
        enterpriseRegistrationContractDao.selectRegistrationContractManager({
          registrationUuid
        }),
        enterpriseRegistrationSpecimenDao.selectRegistrationSpecimenByRegistrationUuid(
          {
            registrationUuid
          }
        )
      ]);

      // Load the docx file as a binary
      let content = fs.readFileSync(
        path.resolve(__dirname, '../../../template/report.docx'),
        'binary'
      );

      let zip = new PizZip(content);

      let doc = new Docxtemplater();
      doc.loadZip(zip);

      let data = {};

      Object.assign(
        data,
        contract,
        basic,
        registration,
        contractManager,
        specimen
      );

      moment.locale('zh-cn');

      if (data.devStartTime) {
        data.devStartTime = moment(data.devStartTime).format('YYYY.MM.DD');
      }

      if (data.specimenHaveTime) {
        data.specimenHaveTime = moment(data.specimenHaveTime).format(
          'YYYY.MM.DD'
        );
      }

      // 设置模板数据
      doc.setData(data);

      // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
      doc.render();

      let buf = doc.getZip().generate({ type: 'nodebuffer' });

      return await fileService.uploadDownloadBufFile(buf, 'registration');
      // 数据整理
    } else {
      throw new CustomError('现状态无法生成报告模板');
    }
  },

  /**
   * 生成原始记录模板
   */
  generateRecordWord: async registrationUuid => {
    const statusList = await enterpriseRegistrationStepDao.queryEnterpriseRegistrationStepByRegistrationUuid(
      { registrationUuid }
    );

    // 判断状态是否ok
    if (statusList[3].status >= 4) {
      // 根据模板生成word返回
      // 查询有关report的0内容
      const [
        contract,
        basic,
        registration,
        contractManager,
        specimen
      ] = await Promise.all([
        enterpriseRegistrationContractDao.selectRegistrationContractByRegistrationUuid(
          {
            registrationUuid
          }
        ),
        enterpriseRegistrationBasicDao.selectRegistrationBasicByRegistrationUuid(
          {
            registrationUuid
          }
        ),
        enterpriseRegistrationDao.selectRegistrationByRegistrationUuid({
          registrationUuid
        }),
        enterpriseRegistrationContractDao.selectRegistrationContractManager({
          registrationUuid
        }),
        enterpriseRegistrationSpecimenDao.selectRegistrationSpecimenByRegistrationUuid(
          {
            registrationUuid
          }
        )
      ]);

      // Load the docx file as a binary
      let content = fs.readFileSync(
        path.resolve(__dirname, '../../../template/record.docx'),
        'binary'
      );

      let zip = new PizZip(content);

      let doc = new Docxtemplater();
      doc.loadZip(zip);

      let data = {};

      Object.assign(
        data,
        contract,
        basic,
        registration,
        contractManager,
        specimen
      );

      moment.locale('zh-cn');

      // 设置模板数据
      doc.setData(data);

      // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
      doc.render();

      let buf = doc.getZip().generate({ type: 'nodebuffer' });

      return await fileService.uploadDownloadBufFile(buf, 'registration');
      // 数据整理
    } else {
      throw new CustomError('现状态无法生成原始记录模板');
    }
  },

  /**
   * 查询现场记录信息
   */
  selectRegistrationRecordByRegistrationUuid: registrationUuid =>
    enterpriseRegistrationOriginalRecordDao.selectRegistrationRecordByRegistrationUuid({
      registrationUuid
    }),

  /**
   * 保存现场记录信息
   */
  saveTechRegistrationRecord: async ({
    registrationUuid,
    url,
    totalPage,
    techManagerUuid
  }) => {
    try {
      if (!(totalPage >= 1 && totalPage <= 999)) {
        throw new CustomError('原始记录总页数不符合规则!');
      }

      return db.transaction(async transaction => {
        const [{ currentStep }, record] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationOriginalRecordDao.selectRegistrationRecordStatus(
            {
              registrationUuid,
              transaction
            }
          )
        ]);

        if (currentStep !== 4 || record.status > 1 || record.status === 0) {
          throw new CustomError('当前步骤不允许保存现场记录信息!');
        }
        let productionUrl = '';
        // 将temp的文件copy到production中
        const [filePosition] = url.split('/');

        if (filePosition === 'temp') {
          const tempUrl = url;
          productionUrl = url.replace('temp', 'production');
          const record = await enterpriseRegistrationOriginalRecordDao.selectRegistrationRecordByRegistrationUuid(
            {
              registrationUuid,
              transaction
            }
          );

          if (record?.url) {
            await client.delete(record.url);
          }

          await client.copy(productionUrl, tempUrl);
        } else if (filePosition === 'production') {
          productionUrl = url;
        } else {
          throw new CustomError('oss文件路径错误');
        }

        return await enterpriseRegistrationOriginalRecordDao.updateRegistrationRecord(
          {
            registrationUuid,
            url: productionUrl,
            status: 2,
            totalPage,
            failText: null,
            techManagerUuid,
            techManagerDate: new Date(),
            transaction
          }
        );
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 管理员查询原始记录信息和状态
   */
  getManagerRegistrationRecord: registrationUuid =>
    enterpriseRegistrationOriginalRecordDao.selectManagerRegistrationRecordByRegistrationUuid(
      {
        registrationUuid
      }
    ),

  /**
   * 查询现场报告信息
   */
  selectRegistrationReportByRegistrationUuid: registrationUuid =>
    enterpriseRegistrationReportDao.selectRegistrationReportByRegistrationUuid(
      registrationUuid
    ),

  /**
   * 保存现场报告信息
   */
  saveTechRegistrationReport: async ({
    registrationUuid,
    url,
    totalPage,
    techManagerUuid
  }) => {
    try {
      if (!(totalPage >= 1 && totalPage <= 999)) {
        throw new CustomError('现场报告总页数不符合规则!');
      }

      return db.transaction(async transaction => {
        const [{ currentStep }, report] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationReportDao.selectRegistrationReportStatus({
            registrationUuid,
            transaction
          })
        ]);

        if (currentStep !== 4 || report.status > 1 || report.status === 0) {
          throw new CustomError('当前步骤不允许保存现场报告信息!');
        }
        let productionUrl = '';
        // 将temp的文件copy到production中
        const [filePosition] = url.split('/');

        if (filePosition === 'temp') {
          const tempUrl = url;
          productionUrl = url.replace('temp', 'production');
          const report = await enterpriseRegistrationReportDao.selectRegistrationReportByRegistrationUuid(
            registrationUuid
          );

          if (report?.url) {
            await client.delete(report.url);
          }

          await client.copy(productionUrl, tempUrl);
        } else if (filePosition === 'production') {
          productionUrl = url;
        } else {
          throw new CustomError('oss文件路径错误');
        }

        return await enterpriseRegistrationReportDao.updateRegistrationReport({
          registrationUuid,
          url: productionUrl,
          status: 2,
          totalPage,
          techManagerUuid,
          failText: null,
          techManagerDate: new Date(),
          transaction
        });
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 管理员查询现场报告信息和状态
   */
  getManagerRegistrationReport: registrationUuid =>
    enterpriseRegistrationReportDao.selectManagerRegistrationReportByRegistrationUuid(
      {
        registrationUuid
      }
    ),

  /**
   * 查询原始记录信息
   */
  getRegistrationRecordStatus: registrationUuid =>
    enterpriseRegistrationOriginalRecordDao.selectRegistrationRecordStatus({
      registrationUuid
    }),

  /**
   * 查询现场记录信息
   */
  getRegistrationReportStatus: registrationUuid =>
    enterpriseRegistrationReportDao.selectRegistrationReportStatus({
      registrationUuid
    }),

  /**
   * 设置原始记录审核通过状态
   */
  setTechLeaderRegistrationRecordSuccessStatus: ({
    techLeaderManagerUuid,
    registrationUuid
  }) => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, record] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationOriginalRecordDao.selectRegistrationRecordStatus(
            {
              registrationUuid,
              transaction
            }
          )
        ]);

        if (currentStep !== 4 || record.status !== 2) {
          throw new CustomError('当前步骤不允许设置原始记录审核通过状态!');
        }
        return await enterpriseRegistrationOriginalRecordDao.updateRegistrationRecord(
          {
            registrationUuid,
            status: 3,
            techLeaderManagerUuid,
            failText: null,
            techLeaderManagerDate: new Date(),
            transaction
          }
        );
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 设置原始记录审核不通过状态
   */
  setTechLeaderRegistrationRecordFailStatus: ({
    registrationUuid,
    failText
  }) => {
    if (!failText.length || failText.length > 100) {
      throw new CustomError('审核不通过理由文本长度不符合规则!');
    }
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, record] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationOriginalRecordDao.selectRegistrationRecordStatus(
            {
              registrationUuid,
              transaction
            }
          )
        ]);

        if (currentStep !== 4 || record.status !== 2) {
          throw new CustomError('当前步骤不允许设置原始记录审核通过状态!');
        }
        return await enterpriseRegistrationOriginalRecordDao.updateRegistrationRecord(
          {
            registrationUuid,
            status: -2,
            failText,
            transaction
          }
        );
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 设置现场报告审核通过状态
   */
  setTechLeaderRegistrationReportSuccessStatus: ({
    techLeaderManagerUuid,
    registrationUuid
  }) => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, report] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationReportDao.selectRegistrationReportStatus({
            registrationUuid,
            transaction
          })
        ]);

        if (currentStep !== 4 || report.status !== 2) {
          throw new CustomError('当前步骤不允许设置现场报告审核通过状态!');
        }
        return await enterpriseRegistrationReportDao.updateRegistrationReport({
          registrationUuid,
          status: 3,
          techLeaderManagerUuid,
          failText: null,
          techLeaderManagerDate: new Date(),
          transaction
        });
      });
    } catch (error) {
      throw error;
    }
  },
  /**
   * 设置现场报告审核不通过状态
   */
  setTechLeaderRegistrationReportFailStatus: ({
    registrationUuid,
    failText
  }) => {
    if (!failText.length || failText.length > 100) {
      throw new CustomError('审核不通过理由文本长度不符合规则!');
    }
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, report] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationReportDao.selectRegistrationReportStatus({
            registrationUuid,
            transaction
          })
        ]);

        if (currentStep !== 4 || report.status !== 2) {
          throw new CustomError('当前步骤不允许设置现场报告审核通过状态!');
        }
        return await enterpriseRegistrationReportDao.updateRegistrationReport({
          registrationUuid,
          status: -2,
          failText,
          transaction
        });
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 批准人设置原始记录审核通过状态
   */
  setCertifierRegistrationRecordSuccessStatus: ({
    certifierManagerUuid,
    registrationUuid
  }) => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, record] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationOriginalRecordDao.selectRegistrationRecordStatus(
            {
              registrationUuid,
              transaction
            }
          )
        ]);

        if (currentStep !== 4 || record.status !== 3) {
          throw new CustomError('当前步骤不允许设置原始记录审核通过状态!');
        }
        return await enterpriseRegistrationOriginalRecordDao.updateRegistrationRecord(
          {
            registrationUuid,
            status: 4,
            certifierManagerUuid,
            failText: null,
            certifierManagerDate: new Date(),
            transaction
          }
        );
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 批准人设置原始记录审核不通过状态
   */
  setCertifierRegistrationRecordFailStatus: ({
    registrationUuid,
    failText
  }) => {
    if (!failText.length || failText.length > 100) {
      throw new CustomError('审核不通过理由文本长度不符合规则!');
    }
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, record] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationOriginalRecordDao.selectRegistrationRecordStatus(
            {
              registrationUuid,
              transaction
            }
          )
        ]);

        if (currentStep !== 4 || record.status !== 3) {
          throw new CustomError('当前步骤不允许设置原始记录审核通过状态!');
        }
        return await enterpriseRegistrationOriginalRecordDao.updateRegistrationRecord(
          {
            registrationUuid,
            status: -3,
            failText,
            transaction
          }
        );
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 批准人设置现场报告审核通过状态
   */
  setCertifierRegistrationReportSuccessStatus: ({
    certifierManagerUuid,
    registrationUuid
  }) => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, report] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationReportDao.selectRegistrationReportStatus({
            registrationUuid,
            transaction
          })
        ]);

        if (currentStep !== 4 || report.status !== 3) {
          throw new CustomError('当前步骤不允许设置现场报告审核通过状态!');
        }
        return await enterpriseRegistrationReportDao.updateRegistrationReport({
          registrationUuid,
          status: 4,
          certifierManagerUuid,
          failText: null,
          certifierManagerDate: new Date(),
          transaction
        });
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 批准人设置现场报告审核不通过状态
   */
  setCertifierRegistrationReportFailStatus: ({
    registrationUuid,
    failText
  }) => {
    if (!failText.length || failText.length > 100) {
      throw new CustomError('审核不通过理由文本长度不符合规则!');
    }
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, report] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationReportDao.selectRegistrationReportStatus({
            registrationUuid,
            transaction
          })
        ]);

        if (currentStep !== 4 || report.status !== 3) {
          throw new CustomError('当前步骤不允许设置现场报告审核通过状态!');
        }
        return await enterpriseRegistrationReportDao.updateRegistrationReport({
          registrationUuid,
          status: -3,
          failText,
          transaction
        });
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 查找原始记录url
   */
  selectProjectManagerRegistrationRecord: registrationUuid =>
    enterpriseRegistrationOriginalRecordDao.selectProjectManagerRegistrationRecord(
      {
        registrationUuid
      }
    ),

  /**
   * 保存原始记录url
   */
  saveRecordFinaltUrl: async ({
    registrationUuid,
    finalUrl,
    projectManagerUuid
  }) => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, record] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationOriginalRecordDao.selectRegistrationRecordStatus(
            {
              registrationUuid,
              transaction
            }
          )
        ]);

        if (currentStep !== 4 || record.status !== 4) {
          throw new CustomError('当前步骤不允许设置现场报告审核通过状态!');
        }
        let productionUrl = '';
        // 将temp的文件copy到production中
        const [filePosition] = finalUrl.split('/');

        if (filePosition === 'temp') {
          const tempUrl = finalUrl;
          productionUrl = finalUrl.replace('temp', 'production');
          const record = await enterpriseRegistrationOriginalRecordDao.selectProjectManagerRegistrationRecord(
            { registrationUuid, transaction }
          );

          if (record?.finalUrl) {
            await client.delete(record.finalUrl);
          }

          await client.copy(productionUrl, tempUrl);
        } else if (filePosition === 'production') {
          productionUrl = finalUrl;
        } else {
          throw new CustomError('oss文件路径错误');
        }

        await enterpriseRegistrationOriginalRecordDao.updateRegistrationRecord({
          registrationUuid,
          finalUrl: productionUrl,
          projectManagerUuid,
          projectManagerDate: new Date(),
          status: 100,
          transaction
        });

        return await _finishFieldTest({ registrationUuid, transaction });
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 查找原始记录url
   */
  selectProjectManagerRegistrationReport: registrationUuid =>
    enterpriseRegistrationReportDao.selectProjectManagerRegistrationReport({
      registrationUuid
    }),

  /**
   * 保存现场报告url
   */
  saveReportFinaltUrl: async ({
    registrationUuid,
    finalUrl,
    projectManagerUuid
  }) => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, report] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationReportDao.selectRegistrationReportStatus({
            registrationUuid,
            transaction
          })
        ]);

        if (currentStep !== 4 || report.status !== 4) {
          throw new CustomError('当前步骤不允许设置现场报告审核通过状态!');
        }
        let productionUrl = '';
        // 将temp的文件copy到production中
        const [filePosition] = finalUrl.split('/');

        if (filePosition === 'temp') {
          const tempUrl = finalUrl;
          productionUrl = finalUrl.replace('temp', 'production');
          const report = await enterpriseRegistrationReportDao.selectProjectManagerRegistrationReport(
            { registrationUuid, transaction }
          );

          if (report?.finalUrl) {
            await client.delete(report.finalUrl);
          }

          await client.copy(productionUrl, tempUrl);
        } else if (filePosition === 'production') {
          productionUrl = finalUrl;
        } else {
          throw new CustomError('oss文件路径错误');
        }

        await enterpriseRegistrationReportDao.updateRegistrationReport({
          registrationUuid,
          finalUrl: productionUrl,
          projectManagerUuid,
          projectManagerDate: new Date(),
          status: 100,
          transaction
        });

        return await _finishFieldTest({ registrationUuid, transaction });
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 查找原始记录url
   */
  selectEnterpriseRegistrationRecord: registrationUuid =>
    enterpriseRegistrationOriginalRecordDao.selectEnterpriseRegistrationRecord(
      registrationUuid
    ),

  /**
   * 查找现场报告url
   */
  selectEnterpriseRegistrationReport: registrationUuid =>
    enterpriseRegistrationReportDao.selectEnterpriseRegistrationReport(
      registrationUuid
    )
};
