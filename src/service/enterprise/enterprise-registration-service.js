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
import enterpriseRegistrationOriginalRecordDao from '../../dao/enterprise/enterprise-registration-original-record-dao';
import enterpriseRegistrationReportDao from '../../dao/enterprise/enterprise-registration-report-dao';
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

// 工具类
import CustomError from '../../util/custom-error';

export default {
  ...fieldTest,
  ...submitFile,
  ...electronicContract,
  ...payment,

  /**
   * 根据名字查询
   */
  selectEnterpriseRegistrationByName: name =>
    enterpriseRegistrationDao.selectEnterpriseRegistrationByName({ name }),

  /**
   * 根据RegistrationUuid查询
   */
  selectRegistrationByRegistrationUuid: registrationUuid =>
    enterpriseRegistrationDao.selectRegistrationByRegistrationUuid({
      registrationUuid
    }),

  /**
   * 创建登记测试
   */
  createEnterpriseRegistration: async (name, enterpriseUuid) => {
    try {
      const enterpriseRegistrationUuid = uuid.v1();

      await db.transaction(async transaction => {
        if (
          await enterpriseRegistrationDao.selectEnterpriseRegistrationByName({
            name,
            transaction
          })
        ) {
          throw new CustomError('登记测试名重复');
        } else {
          // 查询一个项目管理员
          const projectManager = await managerUserDao.selectManagerUserByRole({
            role: 10,
            transaction
          });
          const projectManagerUuid = projectManager?.uuid; // 初始化步骤的数据

          const enterpriseRegistrationSteps = [
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
            enterpriseRegistrationOriginalRecordDao.insertRegistrationRecord({
              uuid: enterpriseRegistrationUuid,
              transaction
            }),
            enterpriseRegistrationReportDao.insertRegistrationReport({
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
        }
      });

      return enterpriseRegistrationUuid;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 查询登记测试通过企业的uuid
   */
  queryRegistrationByEnterpriseUuid: (enterpriseUuid, page) =>
    enterpriseRegistrationDao.queryRegistrationByEnterpriseUuid(
      enterpriseUuid,
      page
    ),

  /**
   * 查询企业用户登记测试具体的步骤状态
   */
  queryEnterpriseRegistrationStepByRegistrationUuid: registrationUuid =>
    enterpriseRegistrationStepDao.queryEnterpriseRegistrationStepByRegistrationUuid(
      { registrationUuid }
    ),

  /**
   *  无参数查询sys_registration_step表
   */
  querySysRegistrationStep: () =>
    sysRegistrationStepDao.querySysRegistrationStep(),
  /**
   * 查询登记测试
   */
  queryRegistration: page => enterpriseRegistrationDao.queryRegistration(page),

  /**
   * 推进登记测试的进程
   */
  pushRegistrationProcess: async registrationUuid => {
    // 先查询现在的进度,
    // 然后如果是进度1,就判断8种状态是不是都是2
    // 最后如果ok就进度改称,而且进度1的text改成已完成
    try {
      const registration = await enterpriseRegistrationDao.selectRegistrationByRegistrationUuid(
        { registrationUuid }
      );

      if (registration) {
        if (registration.currentStep === 3) {
          const steps = await enterpriseRegistrationStepDao.queryEnterpriseRegistrationStepByRegistrationUuid(
            registrationUuid
          );

          // 财务通过之后
          if (steps[2].status === 4) {
            return await Promise.all([
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
          }
        }
      }
    } catch (error) {
      throw error;
    }
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
      throw error;
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
      throw error;
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
      throw error;
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
      throw error;
    }
  },

  generateContractWord: async registrationUuid => {
    // 先判断statusManager是不是2
    // 再用数据库中的数据通过模板生成word
    // 等到上传盖章pdf上传完成后删除word
    try {
      const statusList = await enterpriseRegistrationStepDao.queryEnterpriseRegistrationStepByRegistrationUuid(
        { registrationUuid }
      );

      if (statusList[1].status >= 2) {
        // 查询contract内容
        const [
          contract,
          basic,
          registration,
          contractManager
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

        moment.locale('zh-cn');
        // 数据整理
        if (!data.fax) {
          data.fax = '';
        }

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

        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render();

        let buf = doc.getZip().generate({ type: 'nodebuffer' });

        return await fileService.uploadDownloadBufFile(buf, 'registration');
      } else {
        throw new CustomError('目前状态不可以生成合同');
      }
    } catch (error) {
      throw error;
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
      throw error;
    }
  }
};
