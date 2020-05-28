import { db } from '../../../db/db-connect';

// dao
import enterpriseDelegationBasicDao from '../../../dao/enterprise/enterprise-delegation-basic-dao';
import enterpriseDelegationContractDao from '../../../dao/enterprise/enterprise-delegation-contract-dao';
import managerUserDao from '../../../dao/manager/manager-user-dao';
import enterpriseDelegationDao from '../../../dao/enterprise/enterprise-delegation-dao';
import enterpriseDelegationStepDao from '../../../dao/enterprise/enterprise-delegation-step-dao';
import enterpriseUserDao from '../../../dao/enterprise/enterprise-user-dao';
import enterpriseDelegationSpecimenDao from '../../../dao/enterprise/enterprise-delegation-specimen-dao';
import enterpriseDelegationApplyDao from '../../../dao/enterprise/enterprise-delegation-apply-dao';
import enterpriseDelegationOriginalRecordDao from '../../../dao/enterprise/enterprise-delegation-original-record-dao';
import enterpriseDelegationReportDao from '../../../dao/enterprise/enterprise-delegation-report-dao';

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

const _pushDelegationFieldTestStatus = async ({ delegationUuid, transaction }) => {
  // 查询当前步骤,
  const steps = await enterpriseDelegationStepDao.queryEnterpriseDelegationStepByDelegationUuid(
    { delegationUuid, transaction }
  );

  if (steps[3].status === 3) {
    const [apply, specimen] = await Promise.all([
      enterpriseDelegationApplyDao.selectDelegationTestApply({
        delegationUuid,
        transaction
      }),
      enterpriseDelegationSpecimenDao.selectDelegationTestSpecimen({
        delegationUuid,
        transaction
      })
    ]);

    // 如果为3,就判断两个表中的managerStatus是否为100
    if (apply.managerStatus === 100 && specimen.managerStatus === 100) {
      // 如果ok就把status改为4
      await Promise.all([
        enterpriseDelegationStepDao.updateDelegationStep({
          delegationUuid,
          status: 4,
          statusText: '生成并审核原始报告和记录',
          step: 4,
          transaction
        }),
        enterpriseDelegationOriginalRecordDao.updateDelegationRecord({
          delegationUuid,
          status: 1,
          transaction
        }),
        enterpriseDelegationReportDao.updateDelegationReport({
          delegationUuid,
          status: 1,
          transaction
        })
      ]);
    }
  }
};

const _finishDelegationFieldTest = async ({ delegationUuid, transaction }) => {
  // 查询当前步骤,
  const steps = await enterpriseDelegationStepDao.queryEnterpriseDelegationStepByDelegationUuid(
    { delegationUuid, transaction }
  );

  if (steps[3].status === 4) {
    const [record, report] = await Promise.all([
      enterpriseDelegationOriginalRecordDao.selectManagerDelegationRecordByDelegationUuid(
        {
          delegationUuid,
          transaction
        }
      ),
      enterpriseDelegationReportDao.selectManagerDelegationReportByDelegationUuid(
        {
          delegationUuid,
          transaction
        }
      )
    ]);

    if (record.status === 100 && report.status === 100) {
      await Promise.all([
        enterpriseDelegationStepDao.updateDelegationStep({
          delegationUuid,
          status: 100,
          statusText: '已完成',
          step: 4,
          transaction
        }),
        enterpriseDelegationStepDao.updateDelegationStep({
          delegationUuid,
          status: 100,
          statusText: '企业接受报告和原始记录',
          step: 5,
          transaction
        }),
        enterpriseDelegationDao.updateDelegationCurrentStep({
          delegationUuid,
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
  selectDelegationTechManagerUuid: async delegationUuid => {
    try {
      return (
        await enterpriseDelegationDao.selectDelegationTechManagerUuid(
          delegationUuid
        )
      )?.techManagerUuid;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 查询登记测试技术负责人的uuid
   */
  selectDelegationTechLeaderManagerUuid: async delegationUuid => {
    try {
      return (
        await enterpriseDelegationDao.selectDelegationTechLeaderManagerUuid(
          delegationUuid
        )
      )?.techLeaderManagerUuid;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 安排技术负责人
   */
  arrangeDelegationTechLeaderManager: ({ delegationUuid, technicalManagerUuid }) => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, steps] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationStepDao.queryEnterpriseDelegationStepByDelegationUuid(
            {
              delegationUuid,
              transaction
            }
          )
        ]);

        if (currentStep !== 4 || steps[3].status !== 1) {
          throw new CustomError('当前步骤不允许安排技术负责人!');
        }
        return await Promise.all([
          enterpriseDelegationStepDao.updateDelegationStep({
            delegationUuid,
            status: 2,
            statusText: '已选择技术负责人',
            step: 4,
            transaction
          }),
          enterpriseDelegationStepDao.updateDelegationStepManagerUuid({
            delegationUuid,
            step: 4,
            managerUuid: technicalManagerUuid,
            transaction
          }),
          enterpriseDelegationDao.updateDelegationTechLeaderUuid({
            delegationUuid,
            techLeaderManagerUuid: technicalManagerUuid,
            transaction
          }),
          enterpriseDelegationApplyDao.updateDelegationApplyManagerUuid({
            delegationUuid,
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
  queryDelegationNeedAssigned: async ({ page, managerUuid }) => {
    try {
      const delegationList = await enterpriseDelegationStepDao.queryDelegationNeedAssignedByManagerUuid(
        managerUuid
      );

      const uuidList = delegationList.map(item => item.uuid);

      return await enterpriseDelegationDao.queryDelegationNeedAssigned({
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
  arrangeDelegationTechManager: ({ delegationUuid, techManagerUuid }) => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, steps] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationStepDao.queryEnterpriseDelegationStepByDelegationUuid(
            {
              delegationUuid,
              transaction
            }
          )
        ]);

        if (currentStep !== 4 || steps[3].status !== 2) {
          throw new CustomError('当前步骤不允许安排技术人员!');
        }
        return await Promise.all([
          enterpriseDelegationStepDao.updateDelegationStep({
            delegationUuid,
            status: 3,
            statusText: '已选择技术人员',
            step: 4,
            transaction
          }),
          enterpriseDelegationDao.updateDelegationTechManagerUuid({
            delegationUuid,
            techManagerUuid,
            transaction
          }),
          enterpriseDelegationApplyDao.updateDelegationApplyManagerStatus({
            delegationUuid,
            managerStatus: 1,
            transaction
          }),
          enterpriseDelegationApplyDao.updateDelegationApplyManagerUuid({
            delegationUuid,
            techManagerUuid,
            transaction
          }),
          enterpriseDelegationSpecimenDao.updateDelegationSpecimenManagerStatus({
            delegationUuid,
            managerStatus: 1,
            transaction
          }),
          enterpriseDelegationSpecimenDao.updateDelegationSpecimenManagerUuid({
            delegationUuid,
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
  selectEnterpriseInfoByFileDownloadDelegationUuid: async delegationUuid => {
    try {
      const uuid = await enterpriseDelegationDao.selectEnterpriseInfoByDelegationUuid(
        delegationUuid
      );

      return await enterpriseUserDao.selectEnterpriseByUuid(
        uuid.enterpriseUuid
      );
    } catch (error) {
      throw error;
    }
  },

  /**
   * 根据DelegationUuid查询5个管理员信息
   */
  selectDelegationManagerUuid: delegationUuid =>
    enterpriseDelegationDao.selectDelegationByDelegationUuid({
      delegationUuid
    }),

  /**
   * 根据DelegationUuid查询5个管理员信息
   */
  getDelegationManagerInfo: async delegationUuid => {
    try {
      const delegationManagerUuidList = await enterpriseDelegationDao.selectDelegationByDelegationUuid(
        { delegationUuid }
      );
      let managerList = await Promise.all([
        managerUserDao.selectManagerByManagerUuidAndRole({
          managerUuid: delegationManagerUuidList.projectManagerUuid,
          role: 10
        }),
        managerUserDao.selectManagerByManagerUuidAndRole({
          managerUuid: delegationManagerUuidList.accountantManagerUuid,
          role: 5
        }),
        managerUserDao.selectManagerByManagerUuidAndRole({
          managerUuid: delegationManagerUuidList.techLeaderManagerUuid,
          role: 15
        }),
        managerUserDao.selectManagerByManagerUuidAndRole({
          managerUuid: delegationManagerUuidList.techManagerUuid,
          role: 20
        }),
        managerUserDao.selectManagerByManagerUuidAndRole({
          managerUuid: delegationManagerUuidList.certifierManagerUuid,
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
  quaryDelegationNeedFieldTest: ({ page, managerUuid }) => {
    try {
      return enterpriseDelegationDao.quaryDelegationNeedFieldTest({
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
  getDelegationTestSpecimen: delegationUuid =>
    enterpriseDelegationSpecimenDao.selectDelegationTestSpecimen({
      delegationUuid
    }),

  /**
   * 技术人员查询现场测试申请表的基本信息
   */
  getDelegationTestApply: delegationUuid =>
    enterpriseDelegationApplyDao.selectDelegationTestApply({
      delegationUuid
    }),

  /**
   * 技术人员设置现场申请表审核通过状态
   */
  setDelegationTechApplyManagerStatus: delegationUuid => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, apply] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationApplyDao.selectDelegationApplyManagerStatus({
            delegationUuid,
            transaction
          })
        ]);

        if (currentStep !== 4 || apply.managerStatus !== 1) {
          throw new CustomError('当前步骤不允许设置现场申请表审核通过状态!');
        }
        return await enterpriseDelegationApplyDao.updateDelegationApplyManagerStatus({
          delegationUuid,
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
  setDelegationTechApplyManagerFailStatus: ({ delegationUuid, failManagerText }) => {
    try {
      if (!failManagerText.length || failManagerText.length > 100) {
        throw new CustomError('审核不通过理由文本长度不符合规则!');
      }
      return db.transaction(async transaction => {
        const [{ currentStep }, apply] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationApplyDao.selectDelegationApplyManagerStatus({
            delegationUuid,
            transaction
          })
        ]);

        if (currentStep !== 4 || apply.managerStatus !== 1) {
          throw new CustomError('当前步骤不允许设置现场申请表审核通过状态!');
        }
        return await enterpriseDelegationApplyDao.updateDelegationApplyManagerStatus({
          delegationUuid,
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
  setDelegationTechSpecimenManagerStatus: delegationUuid => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, specimen] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationSpecimenDao.selectDelegationSpecimenManagerStatus(
            {
              delegationUuid,
              transaction
            }
          )
        ]);

        if (currentStep !== 4 || specimen.managerStatus !== 1) {
          throw new CustomError('当前步骤不允许设置样品登记表审核通过状态!');
        }
        return await enterpriseDelegationSpecimenDao.updateDelegationSpecimenManagerStatus(
          {
            delegationUuid,
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
  setDelegationTechSpecimenManagerFailStatus: ({ delegationUuid, failManagerText }) => {
    try {
      if (!failManagerText.length || failManagerText.length > 100) {
        throw new CustomError('审核不通过理由文本长度不符合规则!');
      }
      return db.transaction(async transaction => {
        const [{ currentStep }, specimen] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationSpecimenDao.selectDelegationSpecimenManagerStatus(
            {
              delegationUuid,
              transaction
            }
          )
        ]);

        if (currentStep !== 4 || specimen.managerStatus !== 1) {
          throw new CustomError('当前步骤不允许设置样品登记表审核通过状态!');
        }
        return await enterpriseDelegationSpecimenDao.updateDelegationSpecimenManagerStatus(
          {
            delegationUuid,
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
  setDelegationProjectSpecimenManagerStatus: ({
    projectManagerUuid,
    delegationUuid
  }) => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, specimen] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationSpecimenDao.selectDelegationSpecimenManagerStatus(
            {
              delegationUuid,
              transaction
            }
          )
        ]);

        if (currentStep !== 4 || specimen.managerStatus !== 2) {
          throw new CustomError('当前步骤不允许设置样品登记表审核通过状态!');
        }
        await enterpriseDelegationSpecimenDao.updateDelegationSpecimenManagerStatus({
          delegationUuid,
          projectManagerDate: new Date(),
          projectManagerUuid,
          failManagerText: null,
          managerStatus: 100,
          transaction
        });

        return await _pushDelegationFieldTestStatus({ delegationUuid, transaction });
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 项目管理员设置样品登记表审核不通过状态
   */
  setDelegationProjectSpecimenManagerFailStatus: ({
    delegationUuid,
    failManagerText
  }) => {
    try {
      if (!failManagerText.length || failManagerText.length > 100) {
        throw new CustomError('审核不通过理由文本长度不符合规则!');
      }
      return db.transaction(async transaction => {
        const [{ currentStep }, specimen] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationSpecimenDao.selectDelegationSpecimenManagerStatus(
            {
              delegationUuid,
              transaction
            }
          )
        ]);

        if (currentStep !== 4 || specimen.managerStatus !== 2) {
          throw new CustomError('当前步骤不允许设置样品登记表审核通过状态!');
        }
        return await enterpriseDelegationSpecimenDao.updateDelegationSpecimenManagerStatus(
          {
            delegationUuid,
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
  setDelegationTechLeaderApplyManagerStatus: delegationUuid => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, apply] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationApplyDao.selectDelegationApplyManagerStatus({
            delegationUuid,
            transaction
          })
        ]);

        if (currentStep !== 4 || apply.managerStatus !== 2) {
          throw new CustomError('当前步骤不允许设置现场申请表审核通过状态!');
        }
        await enterpriseDelegationApplyDao.updateDelegationApplyManagerStatus({
          delegationUuid,
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
  setDelegationTechLeaderApplyManagerFailStatus: ({
    delegationUuid,
    failManagerText
  }) => {
    try {
      if (!failManagerText.length || failManagerText.length > 100) {
        throw new CustomError('审核不通过理由文本长度不符合规则!');
      }
      return db.transaction(async transaction => {
        const [{ currentStep }, apply] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationApplyDao.selectDelegationApplyManagerStatus({
            delegationUuid,
            transaction
          })
        ]);

        if (currentStep !== 4 || apply.managerStatus !== 2) {
          throw new CustomError('当前步骤不允许设置现场申请表审核通过状态!');
        }
        return await enterpriseDelegationApplyDao.updateDelegationApplyManagerStatus({
          delegationUuid,
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
  quaryDelegationNeedCertified: async ({ page, certifierManagerUuid }) => {
    try {
      const delegationList = await enterpriseDelegationStepDao.quaryCertifyDelegation();

      const uuidList = delegationList.map(item => item.uuid);

      return enterpriseDelegationDao.quaryDelegationNeedCertified({
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
  setDelegationCertifierApplyManagerStatus: ({
    delegationUuid,
    certifierManagerUuid
  }) => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, apply] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationApplyDao.selectDelegationApplyManagerStatus({
            delegationUuid,
            transaction
          })
        ]);

        if (currentStep !== 4 || apply.managerStatus !== 3) {
          throw new CustomError('当前步骤不允许设置现场申请表审核通过状态!');
        }
        await Promise.all([
          enterpriseDelegationApplyDao.updateDelegationApplyManagerStatus({
            delegationUuid,
            failManagerText: null,
            certifierManagerUuid,
            certifierManagerDate: new Date(),
            managerStatus: 100,
            transaction
          }),
          enterpriseDelegationDao.updateDelegationCertifierManagerUuid({
            delegationUuid,
            certifierManagerUuid,
            transaction
          })
        ]);

        return await _pushDelegationFieldTestStatus({ delegationUuid, transaction });
      });
    } catch (error) {
      throw error;
    }
  },
  /**
   * 批准人设置现场申请表审核不通过状态
   */
  setDelegationCertifierApplyManagerFailStatus: ({
    delegationUuid,
    failManagerText
  }) => {
    try {
      if (!failManagerText.length || failManagerText.length > 100) {
        throw new CustomError('审核不通过理由文本长度不符合规则!');
      }
      return db.transaction(async transaction => {
        const [{ currentStep }, apply] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationApplyDao.selectDelegationApplyManagerStatus({
            delegationUuid,
            transaction
          })
        ]);

        if (currentStep !== 4 || apply.managerStatus !== 3) {
          throw new CustomError('当前步骤不允许设置现场申请表审核通过状态!');
        }
        return await enterpriseDelegationApplyDao.updateDelegationApplyManagerStatus({
          delegationUuid,
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
  selectTestDelegationSpecimenByDelegationUuid: delegationUuid =>
    enterpriseDelegationSpecimenDao.selectDelegationTestSpecimen({
      delegationUuid
    }),

  /**
   * 企业查询现场测试申请表的基本信息
   */
  selectTestDelegationApplyByDelegationUuid: delegationUuid =>
    enterpriseDelegationApplyDao.selectDelegationTestApply({
      delegationUuid
    }),

  /**
   * 企业保存样品登记表信息
   */
  saveTestDelegationSpecimen: ({
    delegationUuid,
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
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationSpecimenDao.selectDelegationSpecimenManagerStatus(
            {
              delegationUuid,
              transaction
            }
          )
        ]);

        if (currentStep !== 4 || specimen.managerStatus > 0) {
          throw new CustomError('当前步骤不允许修改样品登记表!');
        }
        return await enterpriseDelegationSpecimenDao.updateDelegationSpecimen(
          {
            delegationUuid,
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
  saveTestDelegationApply: ({ delegationUuid, content }) => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, apply] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationApplyDao.selectDelegationApplyManagerStatus({
            delegationUuid,
            transaction
          })
        ]);

        if (currentStep !== 4 || apply.managerStatus > 0) {
          throw new CustomError('当前步骤不允许修改现场测试申请表!');
        }
        return await enterpriseDelegationApplyDao.updateDelegationApply({
          delegationUuid,
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
  generateDelegationReportWord: async delegationUuid => {
    const statusList = await enterpriseDelegationStepDao.queryEnterpriseDelegationStepByDelegationUuid(
      { delegationUuid }
    );

    // 判断状态是否ok
    if (statusList[3].status >= 4) {
      // 根据模板生成word返回
      // 查询有关report的0内容
      const [
        contract,
        basic,
        delegation,
        contractManager,
        specimen
      ] = await Promise.all([
        enterpriseDelegationContractDao.selectDelegationContractByDelegationUuid(
          {
            delegationUuid
          }
        ),
        enterpriseDelegationBasicDao.selectDelegationBasicByDelegationUuid(
          {
            delegationUuid
          }
        ),
        enterpriseDelegationDao.selectDelegationByDelegationUuid({
          delegationUuid
        }),
        enterpriseDelegationContractDao.selectDelegationContractManager({
          delegationUuid
        }),
        enterpriseDelegationSpecimenDao.selectDelegationSpecimenByDelegationUuid(
          {
            delegationUuid
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
        delegation,
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

      return await fileService.uploadDownloadBufFile(buf, 'delegation');
      // 数据整理
    } else {
      throw new CustomError('现状态无法生成报告模板');
    }
  },

  /**
   * 生成原始记录模板
   */
  generateDelegationRecordWord: async delegationUuid => {
    const statusList = await enterpriseDelegationStepDao.queryEnterpriseDelegationStepByDelegationUuid(
      { delegationUuid }
    );

    // 判断状态是否ok
    if (statusList[3].status >= 4) {
      // 根据模板生成word返回
      // 查询有关report的0内容
      const [
        contract,
        basic,
        delegation,
        contractManager,
        specimen
      ] = await Promise.all([
        enterpriseDelegationContractDao.selectDelegationContractByDelegationUuid(
          {
            delegationUuid
          }
        ),
        enterpriseDelegationBasicDao.selectDelegationBasicByDelegationUuid(
          {
            delegationUuid
          }
        ),
        enterpriseDelegationDao.selectDelegationByDelegationUuid({
          delegationUuid
        }),
        enterpriseDelegationContractDao.selectDelegationContractManager({
          delegationUuid
        }),
        enterpriseDelegationSpecimenDao.selectDelegationSpecimenByDelegationUuid(
          {
            delegationUuid
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
        delegation,
        contractManager,
        specimen
      );

      moment.locale('zh-cn');

      // 设置模板数据
      doc.setData(data);

      // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
      doc.render();

      let buf = doc.getZip().generate({ type: 'nodebuffer' });

      return await fileService.uploadDownloadBufFile(buf, 'delegation');
      // 数据整理
    } else {
      throw new CustomError('现状态无法生成原始记录模板');
    }
  },

  /**
   * 查询现场记录信息
   */
  selectDelegationRecordByDelegationUuid: delegationUuid =>
    enterpriseDelegationOriginalRecordDao.selectDelegationRecordByDelegationUuid({
      delegationUuid
    }),

  /**
   * 保存现场记录信息
   */
  saveTechDelegationRecord: async ({
    delegationUuid,
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
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationOriginalRecordDao.selectDelegationRecordStatus(
            {
              delegationUuid,
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
          const record = await enterpriseDelegationOriginalRecordDao.selectDelegationRecordByDelegationUuid(
            {
              delegationUuid,
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

        return await enterpriseDelegationOriginalRecordDao.updateDelegationRecord(
          {
            delegationUuid,
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
  getManagerDelegationRecord: delegationUuid =>
    enterpriseDelegationOriginalRecordDao.selectManagerDelegationRecordByDelegationUuid(
      {
        delegationUuid
      }
    ),

  /**
   * 查询现场报告信息
   */
  selectDelegationReportByDelegationUuid: delegationUuid =>
    enterpriseDelegationReportDao.selectDelegationReportByDelegationUuid(
      delegationUuid
    ),

  /**
   * 保存现场报告信息
   */
  saveTechDelegationReport: async ({
    delegationUuid,
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
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationReportDao.selectDelegationReportStatus({
            delegationUuid,
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
          const report = await enterpriseDelegationReportDao.selectDelegationReportByDelegationUuid(
            delegationUuid
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

        return await enterpriseDelegationReportDao.updateDelegationReport({
          delegationUuid,
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
  getManagerDelegationReport: delegationUuid =>
    enterpriseDelegationReportDao.selectManagerDelegationReportByDelegationUuid(
      {
        delegationUuid
      }
    ),

  /**
   * 查询原始记录信息
   */
  getDelegationRecordStatus: delegationUuid =>
    enterpriseDelegationOriginalRecordDao.selectDelegationRecordStatus({
      delegationUuid
    }),

  /**
   * 查询现场记录信息
   */
  getDelegationReportStatus: delegationUuid =>
    enterpriseDelegationReportDao.selectDelegationReportStatus({
      delegationUuid
    }),

  /**
   * 设置原始记录审核通过状态
   */
  setTechLeaderDelegationRecordSuccessStatus: ({
    techLeaderManagerUuid,
    delegationUuid
  }) => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, record] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationOriginalRecordDao.selectDelegationRecordStatus(
            {
              delegationUuid,
              transaction
            }
          )
        ]);

        if (currentStep !== 4 || record.status !== 2) {
          throw new CustomError('当前步骤不允许设置原始记录审核通过状态!');
        }
        return await enterpriseDelegationOriginalRecordDao.updateDelegationRecord(
          {
            delegationUuid,
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
  setTechLeaderDelegationRecordFailStatus: ({
    delegationUuid,
    failText
  }) => {
    if (!failText.length || failText.length > 100) {
      throw new CustomError('审核不通过理由文本长度不符合规则!');
    }
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, record] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationOriginalRecordDao.selectDelegationRecordStatus(
            {
              delegationUuid,
              transaction
            }
          )
        ]);

        if (currentStep !== 4 || record.status !== 2) {
          throw new CustomError('当前步骤不允许设置原始记录审核通过状态!');
        }
        return await enterpriseDelegationOriginalRecordDao.updateDelegationRecord(
          {
            delegationUuid,
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
  setTechLeaderDelegationReportSuccessStatus: ({
    techLeaderManagerUuid,
    delegationUuid
  }) => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, report] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationReportDao.selectDelegationReportStatus({
            delegationUuid,
            transaction
          })
        ]);

        if (currentStep !== 4 || report.status !== 2) {
          throw new CustomError('当前步骤不允许设置现场报告审核通过状态!');
        }
        return await enterpriseDelegationReportDao.updateDelegationReport({
          delegationUuid,
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
  setTechLeaderDelegationReportFailStatus: ({
    delegationUuid,
    failText
  }) => {
    if (!failText.length || failText.length > 100) {
      throw new CustomError('审核不通过理由文本长度不符合规则!');
    }
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, report] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationReportDao.selectDelegationReportStatus({
            delegationUuid,
            transaction
          })
        ]);

        if (currentStep !== 4 || report.status !== 2) {
          throw new CustomError('当前步骤不允许设置现场报告审核通过状态!');
        }
        return await enterpriseDelegationReportDao.updateDelegationReport({
          delegationUuid,
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
  setCertifierDelegationRecordSuccessStatus: ({
    certifierManagerUuid,
    delegationUuid
  }) => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, record] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationOriginalRecordDao.selectDelegationRecordStatus(
            {
              delegationUuid,
              transaction
            }
          )
        ]);

        if (currentStep !== 4 || record.status !== 3) {
          throw new CustomError('当前步骤不允许设置原始记录审核通过状态!');
        }
        return await enterpriseDelegationOriginalRecordDao.updateDelegationRecord(
          {
            delegationUuid,
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
  setCertifierDelegationRecordFailStatus: ({
    delegationUuid,
    failText
  }) => {
    if (!failText.length || failText.length > 100) {
      throw new CustomError('审核不通过理由文本长度不符合规则!');
    }
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, record] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationOriginalRecordDao.selectDelegationRecordStatus(
            {
              delegationUuid,
              transaction
            }
          )
        ]);

        if (currentStep !== 4 || record.status !== 3) {
          throw new CustomError('当前步骤不允许设置原始记录审核通过状态!');
        }
        return await enterpriseDelegationOriginalRecordDao.updateDelegationRecord(
          {
            delegationUuid,
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
  setCertifierDelegationReportSuccessStatus: ({
    certifierManagerUuid,
    delegationUuid
  }) => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, report] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationReportDao.selectDelegationReportStatus({
            delegationUuid,
            transaction
          })
        ]);

        if (currentStep !== 4 || report.status !== 3) {
          throw new CustomError('当前步骤不允许设置现场报告审核通过状态!');
        }
        return await enterpriseDelegationReportDao.updateDelegationReport({
          delegationUuid,
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
  setCertifierDelegationReportFailStatus: ({
    delegationUuid,
    failText
  }) => {
    if (!failText.length || failText.length > 100) {
      throw new CustomError('审核不通过理由文本长度不符合规则!');
    }
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, report] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationReportDao.selectDelegationReportStatus({
            delegationUuid,
            transaction
          })
        ]);

        if (currentStep !== 4 || report.status !== 3) {
          throw new CustomError('当前步骤不允许设置现场报告审核通过状态!');
        }
        return await enterpriseDelegationReportDao.updateDelegationReport({
          delegationUuid,
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
  selectProjectManagerDelegationRecord: delegationUuid =>
    enterpriseDelegationOriginalRecordDao.selectProjectManagerDelegationRecord(
      {
        delegationUuid
      }
    ),

  /**
   * 保存原始记录url
   */
  saveDelegationRecordFinaltUrl: async ({
    delegationUuid,
    finalUrl,
    projectManagerUuid
  }) => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, record] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationOriginalRecordDao.selectDelegationRecordStatus(
            {
              delegationUuid,
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
          const record = await enterpriseDelegationOriginalRecordDao.selectProjectManagerDelegationRecord(
            { delegationUuid, transaction }
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

        await enterpriseDelegationOriginalRecordDao.updateDelegationRecord({
          delegationUuid,
          finalUrl: productionUrl,
          projectManagerUuid,
          projectManagerDate: new Date(),
          status: 100,
          transaction
        });

        return await _finishDelegationFieldTest({ delegationUuid, transaction });
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 查找原始记录url
   */
  selectProjectManagerDelegationReport: delegationUuid =>
    enterpriseDelegationReportDao.selectProjectManagerDelegationReport({
      delegationUuid
    }),

  /**
   * 保存现场报告url
   */
  saveDelegationReportFinaltUrl: async ({
    delegationUuid,
    finalUrl,
    projectManagerUuid
  }) => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, report] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationReportDao.selectDelegationReportStatus({
            delegationUuid,
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
          const report = await enterpriseDelegationReportDao.selectProjectManagerDelegationReport(
            { delegationUuid, transaction }
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

        await enterpriseDelegationReportDao.updateDelegationReport({
          delegationUuid,
          finalUrl: productionUrl,
          projectManagerUuid,
          projectManagerDate: new Date(),
          status: 100,
          transaction
        });

        return await _finishDelegationFieldTest({ delegationUuid, transaction });
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 查找原始记录url
   */
  selectEnterpriseDelegationRecord: delegationUuid =>
    enterpriseDelegationOriginalRecordDao.selectEnterpriseDelegationRecord(
      delegationUuid
    ),

  /**
   * 查找现场报告url
   */
  selectEnterpriseDelegationReport: delegationUuid =>
    enterpriseDelegationReportDao.selectEnterpriseDelegationReport(
      delegationUuid
    )
};
