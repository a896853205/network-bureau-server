import { db } from '../../db/db-connect';

// dao
import enterpriseDelegationDao from '../../dao/enterprise/enterprise-delegation-dao';
import enterpriseDelegationApplyDao from '../../dao/enterprise/enterprise-delegation-apply-dao';
import enterpriseDelegationBasicDao from '../../dao/enterprise/enterprise-delegation-basic-dao';
import enterpriseDelegationContractDao from '../../dao/enterprise/enterprise-delegation-contract-dao';
import enterpriseDelegationCopyrightDao from '../../dao/enterprise/enterprise-delegation-copyright-dao';
import enterpriseDelegationDocumentDao from '../../dao/enterprise/enterprise-delegation-document-dao';
import enterpriseDelegationProductDao from '../../dao/enterprise/enterprise-delegation-product-dao';
import enterpriseDelegationProductDescriptionDao from '../../dao/enterprise/enterprise-delegation-product-description-dao';
import enterpriseDelegationSpecimenDao from '../../dao/enterprise/enterprise-delegation-specimen-dao';
import enterpriseDelegationOriginalRecordDao from '../../dao/enterprise/enterprise-delegation-original-record-dao';
import enterpriseDelegationReportDao from '../../dao/enterprise/enterprise-delegation-report-dao';
import enterpriseDelegationStepDao from '../../dao/enterprise/enterprise-delegation-step-dao';
import sysDelegationStepDao from '../../dao/sys/sys-delegation-step-dao';
import managerUserDao from '../../dao/manager/manager-user-dao';

// 工具
import uuid from 'uuid';

// 子service
import fieldTest from './delegation/field-tests';
import submitFile from './delegation/submit-file';
import electronicContract from './delegation/electronic-contract';
import payment from './delegation/payment';

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
  selectEnterpriseDelegationByName: name =>
    enterpriseDelegationDao.selectEnterpriseDelegationByName({ name }),

  /**
   * 根据DelegationUuid查询
   */
  selectDelegationByDelegationUuid: delegationUuid =>
    enterpriseDelegationDao.selectDelegationByDelegationUuid({
      delegationUuid
    }),

  /**
   * 创建登记测试
   */
  createEnterpriseDelegation: async (name, enterpriseUuid) => {
    try {
      const enterpriseDelegationUuid = uuid.v1();

      await db.transaction(async transaction => {
        if (
          await enterpriseDelegationDao.selectEnterpriseDelegationByName({
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

          const enterpriseDelegationSteps = [
            {
              uuid: enterpriseDelegationUuid,
              step: 1,
              status: 1,
              statusText: '正在进行',
              managerUuid: projectManagerUuid
            },
            {
              uuid: enterpriseDelegationUuid,
              step: 2,
              status: 0,
              statusText: '未开始',
              managerUuid: projectManagerUuid
            },
            {
              uuid: enterpriseDelegationUuid,
              step: 3,
              status: 0,
              statusText: '未开始',
              managerUuid: projectManagerUuid
            },
            {
              uuid: enterpriseDelegationUuid,
              step: 4,
              status: 0,
              statusText: '未开始',
              managerUuid: projectManagerUuid
            },
            {
              uuid: enterpriseDelegationUuid,
              step: 5,
              status: 0,
              statusText: '未开始',
              managerUuid: projectManagerUuid
            },
            {
              uuid: enterpriseDelegationUuid,
              step: 6,
              status: 0,
              statusText: '未开始',
              managerUuid: projectManagerUuid
            }
          ];

          await Promise.all([
            enterpriseDelegationDao.insertEnterpriseDelegation({
              uuid: enterpriseDelegationUuid,
              name,
              enterpriseUuid,
              transaction
            }),
            enterpriseDelegationCopyrightDao.insertDelegationCopyright({
              uuid: enterpriseDelegationUuid,
              transaction
            }),
            enterpriseDelegationContractDao.insertDelegationContract({
              uuid: enterpriseDelegationUuid,
              transaction
            }),
            enterpriseDelegationSpecimenDao.insertDelegationSpecimen({
              uuid: enterpriseDelegationUuid,
              transaction
            }),
            enterpriseDelegationProductDao.insertDelegationProduct({
              uuid: enterpriseDelegationUuid,
              transaction
            }),
            enterpriseDelegationProductDescriptionDao.insertDelegationProductDescription(
              {
                uuid: enterpriseDelegationUuid,
                transaction
              }
            ),
            enterpriseDelegationDocumentDao.insertDelegationDocument({
              uuid: enterpriseDelegationUuid,
              transaction
            }),
            enterpriseDelegationApplyDao.insertDelegationApply({
              uuid: enterpriseDelegationUuid,
              transaction
            }),
            enterpriseDelegationBasicDao.insertDelegationBasic({
              uuid: enterpriseDelegationUuid,
              transaction
            }),
            enterpriseDelegationOriginalRecordDao.insertDelegationRecord({
              uuid: enterpriseDelegationUuid,
              transaction
            }),
            enterpriseDelegationReportDao.insertDelegationReport({
              uuid: enterpriseDelegationUuid,
              transaction
            }),
            enterpriseDelegationDao.updateDelegationProjectManagerUuid({
              delegationUuid: enterpriseDelegationUuid,
              projectManagerUuid,
              transaction
            })
          ]);
          return await enterpriseDelegationStepDao.bulkInsertDelegationStep(
            {
              enterpriseDelegationSteps,
              transaction
            }
          );
        }
      });

      return enterpriseDelegationUuid;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 查询登记测试通过企业的uuid
   */
  queryDelegationByEnterpriseUuid: (enterpriseUuid, page) =>
    enterpriseDelegationDao.queryDelegationByEnterpriseUuid(
      enterpriseUuid,
      page
    ),

  /**
   * 查询企业用户登记测试具体的步骤状态
   */
  queryEnterpriseDelegationStepByDelegationUuid: delegationUuid =>
    enterpriseDelegationStepDao.queryEnterpriseDelegationStepByDelegationUuid(
      { delegationUuid }
    ),

  /**
   *  无参数查询sys_delegation_step表
   */
  querySysDelegationStep: () =>
    sysDelegationStepDao.querySysDelegationStep(),
  /**
   * 查询登记测试
   */
  queryDelegation: page => enterpriseDelegationDao.queryDelegation(page),

  downloadDelegationProduct: async delegationUuid => {
    try {
      const {
        url
      } = await enterpriseDelegationProductDao.selectDelegationProductUrlByDelegationUuid(
        delegationUuid
      );

      return await fileService.getFileUrl(url);
    } catch (error) {
      throw error;
    }
  },

  downloadDelegationProductDescription: async delegationUuid => {
    try {
      const {
        url
      } = await enterpriseDelegationProductDescriptionDao.selectDelegationProductDescriptionUrlByDelegationUuid(
        delegationUuid
      );

      return await fileService.getFileUrl(url);
    } catch (error) {
      throw error;
    }
  },

  downloadDelegationDocument: async delegationUuid => {
    try {
      const {
        url
      } = await enterpriseDelegationDocumentDao.selectDelegationDocumentUrlByDelegationUuid(
        delegationUuid
      );

      return await fileService.getFileUrl(url);
    } catch (error) {
      throw error;
    }
  },

  downloadDelegationCopyright: async delegationUuid => {
    try {
      const {
        url
      } = await enterpriseDelegationCopyrightDao.selectDelegationCopyrightUrlByDelegationUuid(
        delegationUuid
      );

      return await fileService.getFileUrl(url);
    } catch (error) {
      throw error;
    }
  },

  generateDelegationContractWord: async delegationUuid => {
    // 先判断statusManager是不是2
    // 再用数据库中的数据通过模板生成word
    // 等到上传盖章pdf上传完成后删除word
    try {
      const statusList = await enterpriseDelegationStepDao.queryEnterpriseDelegationStepByDelegationUuid(
        { delegationUuid }
      );

      if (statusList[1].status >= 2) {
        // 查询contract内容
        const [
          contract,
          basic,
          delegation,
          contractManager
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
          })
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

        Object.assign(data, contract, basic, delegation, contractManager);

        moment.locale('zh-cn');
        // 数据整理

        if (data.devStartTime) {
          data.devStartTime = moment(data.devStartTime).format('YYYY/MM/DD');
        }

        if (data.specimenHaveTime) {
          data.specimenHaveTime = moment(data.specimenHaveTime).format('LL');
        }

        if (data.contractTime) {
          data.contractTime = moment(data.contractTime).format('LL');
        }
        // 设置模板数据
        doc.setData(data);

        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
        doc.render();

        let buf = doc.getZip().generate({ type: 'nodebuffer' });

        return await fileService.uploadDownloadBufFile(buf, 'delegation');
      } else {
        throw new CustomError('目前状态不可以生成合同');
      }
    } catch (error) {
      throw error;
    }
  },

  downloadDelegationContract: async delegationUuid => {
    try {
      // 查询contract内容
      const {
        managerUrl
      } = await enterpriseDelegationContractDao.selectDelegationContractUrl({
        delegationUuid
      });

      return await fileService.getFileUrl(managerUrl);
    } catch (error) {
      throw error;
    }
  }
};
