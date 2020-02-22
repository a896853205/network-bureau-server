import { db } from '../../../db/db-connect';

// dao
import managerUserDao from '../../../dao/manager/manager-user-dao';
import enterpriseRegistrationDao from '../../../dao/enterprise/enterprise-registration-dao';
import enterpriseRegistrationStepDao from '../../../dao/enterprise/enterprise-registration-step-dao';
import enterpriseUserDao from '../../../dao/enterprise/enterprise-user-dao';
import enterpriseRegistrationSpecimenDao from '../../../dao/enterprise/enterprise-registration-specimen-dao';
import enterpriseRegistrationApplyDao from '../../../dao/enterprise/enterprise-registration-apply-dao';

// oss
import client from '../../../util/oss';
import CustomError from '../../../util/custom-error';

const _pushFieldTestStatus = async ({ registrationUuid, transaction }) => {
  // 查询当前步骤,
  const steps = await enterpriseRegistrationStepDao.queryEnterpriseRegistrationStepByRegistrationUuid(
    registrationUuid
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
      await enterpriseRegistrationStepDao.updateRegistrationStep({
        registrationUuid,
        status: 4,
        step: 4,
        transaction
      });
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
      ).techManagerUuid;
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
      ).techLeaderManagerUuid;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 安排技术负责人
   */
  arrangeTechLeaderManager: ({ registrationUuid, technicalManagerUuid }) => {
    try {
      return db.transaction(transaction => {
        return Promise.all([
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
      return db.transaction(transaction => {
        return Promise.all([
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
    enterpriseRegistrationDao.selectRegistrationByRegistrationUuid(
      registrationUuid
    ),

  /**
   * 根据RegistrationUuid查询5个管理员信息
   */
  getRegistrationManagerInfo: async registrationUuid => {
    try {
      const registrationManagerUuidList = await enterpriseRegistrationDao.selectRegistrationByRegistrationUuid(
        registrationUuid
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
  setTechApplyManagerStatus: registrationUuid =>
    enterpriseRegistrationApplyDao.updateApplyManagerStatus({
      registrationUuid,
      failManagerText: null,
      techManagerDate: new Date(),
      managerStatus: 2
    }),

  /**
   * 技术人员设置现场申请表审核不通过状态
   */
  setTechApplyManagerFailStatus: ({ registrationUuid, failManagerText }) =>
    enterpriseRegistrationApplyDao.updateApplyManagerStatus({
      registrationUuid,
      failManagerText,
      managerStatus: -1
    }),

  /**
   * 技术人员设置样品登记表审核通过状态
   */
  setTechSpecimenManagerStatus: registrationUuid =>
    enterpriseRegistrationSpecimenDao.updateSpecimenManagerStatus({
      registrationUuid,
      techManagerDate: new Date(),
      failManagerText: null,
      managerStatus: 2
    }),

  /**
   * 技术人员设置样品登记表审核不通过状态
   */
  setTechSpecimenManagerFailStatus: ({ registrationUuid, failManagerText }) =>
    enterpriseRegistrationSpecimenDao.updateSpecimenManagerStatus({
      registrationUuid,
      failManagerText,
      managerStatus: -1
    }),

  /**
   * 项目管理员设置样品登记表审核通过状态
   */
  setProjectSpecimenManagerStatus: registrationUuid =>
    db.transaction(async transaction => {
      await enterpriseRegistrationSpecimenDao.updateSpecimenManagerStatus({
        registrationUuid,
        projectManagerDate: new Date(),
        failManagerText: null,
        managerStatus: 100,
        transaction
      });

      return await _pushFieldTestStatus({ registrationUuid, transaction });
    }),

  /**
   * 项目管理员设置样品登记表审核不通过状态
   */
  setProjectSpecimenManagerFailStatus: ({
    registrationUuid,
    failManagerText
  }) =>
    enterpriseRegistrationSpecimenDao.updateSpecimenManagerStatus({
      registrationUuid,
      failManagerText,
      managerStatus: -2
    }),

  /**
   * 技术负责人设置现场申请表审核通过状态
   */
  setTechLeaderApplyManagerStatus: registrationUuid =>
    enterpriseRegistrationApplyDao.updateApplyManagerStatus({
      registrationUuid,
      failManagerText: null,
      techLeaderManagerDate: new Date(),
      managerStatus: 3
    }),

  /**
   * 技术负责人设置现场申请表审核不通过状态
   */
  setTechLeaderApplyManagerFailStatus: ({
    registrationUuid,
    failManagerText
  }) =>
    enterpriseRegistrationApplyDao.updateApplyManagerStatus({
      registrationUuid,
      failManagerText,
      managerStatus: -2
    }),

  /**
   * 批准人查找注册登记信息
   */
  quaryRegistratiomNeedCertified: ({ page }) => {
    try {
      return enterpriseRegistrationDao.quaryRegistratiomNeedCertified({
        page
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 批准人设置现场申请表审核通过状态
   */
  setCertifierApplyManagerStatus: registrationUuid =>
    db.transaction(async transaction => {
      await enterpriseRegistrationApplyDao.updateApplyManagerStatus({
        registrationUuid,
        failManagerText: null,
        certifierManagerDate: new Date(),
        managerStatus: 100,
        transaction
      });

      return await _pushFieldTestStatus({ registrationUuid, transaction });
    }),
  /**
   * 批准人设置现场申请表审核不通过状态
   */
  setCertifierApplyManagerFailStatus: ({ registrationUuid, failManagerText }) =>
    enterpriseRegistrationApplyDao.updateApplyManagerStatus({
      registrationUuid,
      failManagerText,
      managerStatus: -3
    }),

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
  }) =>
    enterpriseRegistrationSpecimenDao.updateRegistrationSpecimen({
      registrationUuid,
      trademark,
      developmentTool,
      securityClassification,
      email,
      unit,
      managerStatus: 1,
      failManagerText: null
    }),
  /**
   * 保存现场测试申请表的基本信息
   */
  saveTestRegistrationApply: ({ registrationUuid, content }) =>
    enterpriseRegistrationApplyDao.updateRegistrationApply({
      registrationUuid,
      content,
      managerStatus: 1,
      failManagerText: null
    }),

  /**
   * 生成报告模板
   */
  generateReportWord: async registrationUuid => {
    const statusList = await enterpriseRegistrationStepDao.queryEnterpriseRegistrationStepByRegistrationUuid(
      registrationUuid
    );

    // 判断状态是否ok
    if (statusList[4] >= 4) {
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
        ),
        enterpriseRegistrationSpecimenDao.selectRegistrationSpecimenByRegistrationUuid(
          registrationUuid
        )
      ]);

      // Load the docx file as a binary
      let content = fs.readFileSync(
        path.resolve(__dirname, '../../template/report.docx'),
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
  }
};
