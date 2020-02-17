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

// 工具
import uuid from 'uuid';

// 子service
import fieldTest from './registration/field-tests';
import submitFile from './registration/submit-file';
import electronicContract from './registration/electronic-contract';
import payment from './registration/payment';

// 其他service
import fileService from '../user/file-service';

// 生成word
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';

// 时间
import moment from 'moment';

export default {
  ...fieldTest,
  ...submitFile,
  ...electronicContract,
  ...payment,

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

      try {
        await db.transaction(async transaction => {
          await Promise.all([
            enterpriseRegistrationDao.insertEnterpriseRegistration({
              uuid: enterpriseRegistrationUuid,
              name,
              enterpriseUuid,
              transaction
            }),
            enterpriseRegistrationCopyrightDao.insertRegistrationCopyright({
              uuid: enterpriseRegistrationUuid,
              transaction
            }),
            enterpriseRegistrationContractDao.insertRegistrationContract({
              uuid: enterpriseRegistrationUuid,
              transaction
            }),
            enterpriseRegistrationSpecimenDao.insertRegistrationSpecimen({
              uuid: enterpriseRegistrationUuid,
              transaction
            }),
            enterpriseRegistrationProductDao.insertRegistrationProduct({
              uuid: enterpriseRegistrationUuid,
              transaction
            }),
            enterpriseRegistrationProductDescriptionDao.insertRegistrationProductDescription(
              {
                uuid: enterpriseRegistrationUuid,
                transaction
              }
            ),
            enterpriseRegistrationDocumentDao.insertRegistrationDocument({
              uuid: enterpriseRegistrationUuid,
              transaction
            }),
            enterpriseRegistrationApplyDao.insertRegistrationApply({
              uuid: enterpriseRegistrationUuid,
              transaction
            }),
            enterpriseRegistrationBasicDao.insertRegistrationBasic({
              uuid: enterpriseRegistrationUuid,
              transaction
            }),
            enterpriseRegistrationDao.updateRegistrationProjectManagerUuid({
              registrationUuid: enterpriseRegistrationUuid,
              projectManagerUuid,
              transaction
            })
          ]);

          return await enterpriseRegistrationStepDao.bulkInsertRegistrationStep(
            {
              enterpriseRegistrationSteps,
              transaction
            }
          );
        });

        return enterpriseRegistrationUuid;
      } catch (error) {
        console.log(error);
      }
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
   * 查询登记测试
   */
  queryRegistration: async page => {
    return await enterpriseRegistrationDao.queryRegistration(page);
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
              statusText: '管理员填写内容',
              step: 2
            })
          ]);

          return true;
        }
      } else if (registration.currentStep === 2) {
        const steps = await enterpriseRegistrationStepDao.queryEnterpriseRegistrationStepByRegistrationUuid(
          registrationUuid
        );
        // 第二步电子签合同
        if (steps[1].status === 100) {
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
              status: 100,
              statusText: '已完成',
              step: 3
            }),
            enterpriseRegistrationStepDao.updateRegistrationStep({
              registrationUuid,
              status: 1,
              statusText: '未选择测试管理员',
              step: 4
            }),
            enterpriseRegistrationStepDao.updateRegistrationStep({
              registrationUuid,
              status: 100,
              statusText: '已完成',
              step: 3
            })
          ]);

          return true;
        }
      }
    }

    return false;
  },

  downloadProduct: async registrationUuid => {
    try {
      const {
        url
      } = await enterpriseRegistrationProductDao.selectRegistrationProductUrlByRegistrationUuid(
        registrationUuid
      );

      return await fileService.getFileUrl(url);
    } catch (error) {
      console.error('下载登记测试的产品介质错误');
      throw new Error(error);
    }
  },

  downloadProductDescription: async registrationUuid => {
    try {
      const {
        url
      } = await enterpriseRegistrationProductDescriptionDao.selectRegistrationProductDescriptionUrlByRegistrationUuid(
        registrationUuid
      );

      return await fileService.getFileUrl(url);
    } catch (error) {
      console.error('下载登记测试的产品说明错误');
      throw new Error(error);
    }
  },

  downloadDocument: async registrationUuid => {
    try {
      const {
        url
      } = await enterpriseRegistrationDocumentDao.selectRegistrationDocumentUrlByRegistrationUuid(
        registrationUuid
      );

      return await fileService.getFileUrl(url);
    } catch (error) {
      console.error('下载登记测试的用户文档集错误');
      throw new Error(error);
    }
  },

  downloadCopyright: async registrationUuid => {
    try {
      const {
        url
      } = await enterpriseRegistrationCopyrightDao.selectRegistrationCopyrightUrlByRegistrationUuid(
        registrationUuid
      );

      return await fileService.getFileUrl(url);
    } catch (error) {
      console.error('下载登记测试的软件著作权错误');
      throw new Error(error);
    }
  },

  downloadContract: async registrationUuid => {
    try {
      // 查询contract内容
      const {
        enterpriseUrl
      } = await enterpriseRegistrationContractDao.selectContractUrl(
        registrationUuid
      );

      return await fileService.getFileUrl(enterpriseUrl);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};
