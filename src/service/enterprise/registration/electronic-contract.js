import { db } from '../../../db/db-connect';

// oss
import client from '../../../util/oss';

// dao
import enterpriseRegistrationContractDao from '../../../dao/enterprise/enterprise-registration-contract-dao';
import enterpriseRegistrationStepDao from '../../../dao/enterprise/enterprise-registration-step-dao';
import enterpriseRegistrationBasicDao from '../../../dao/enterprise/enterprise-registration-basic-dao';
import enterpriseRegistrationDao from '../../../dao/enterprise/enterprise-registration-dao';

// 生成word
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';

// 时间
import moment from 'moment';

// service
import fileService from '../../user/file-service';

export default {
  downloadContract: async registrationUuid => {
    // 先判断statusManager是不是2
    // 再用数据库中的数据通过模板生成word
    // 等到上传盖章pdf上传完成后删除word
    const statusManager = await enterpriseRegistrationContractDao.selectRegistrationContractManager(
      registrationUuid
    );

    const statusList = await enterpriseRegistrationStepDao.queryEnterpriseRegistrationStepByRegistrationUuid(
      registrationUuid
    );

    if (statusManager && statusList[1].status >= 2) {
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
   * 查询评测合同的url
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
    try {
      await db.transaction(async transaction => {
        return await Promise.all[
          enterpriseRegistrationContractDao.updateRegistrationContractManager(
            {
              registrationUuid,
              contractCode,
              specimenHaveTime,
              payment,
              paymentTime,
              contractTime,
              transaction
            },
            enterpriseRegistrationStepDao.updateRegistrationStep({
              registrationUuid,
              status: 2,
              statusText: '管理员生成合同',
              step: 2,
              transaction
            })
          )
        ];
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
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

      await db.transaction(async transaction => {
        return Promise.all([
          enterpriseRegistrationContractDao.updateManagerContractUrl({
            registrationUuid,
            managerUrl: productionUrl,
            transaction
          }),
          enterpriseRegistrationStepDao.updateRegistrationStep({
            registrationUuid,
            status: 3,
            statusText: '企业上传合同',
            step: 2,
            transaction
          })
        ]);
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
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

      await db.transaction(transaction => {
        return Promise.all([
          enterpriseRegistrationContractDao.updateEnterpriseContractUrl({
            registrationUuid,
            enterpriseUrl: productionUrl,
            managerFailText: '',
            transaction
          }),
          enterpriseRegistrationStepDao.updateRegistrationStep({
            status: 4,
            step: 2,
            registrationUuid,
            statusText: '审核最终合同',
            transaction
          })
        ]);
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  /**
   * 设置第二步合同签署成功状态
   */
  setContractManagerSuccessStatus: async registrationUuid => {
    try {
      await db.transaction(async transaction => {
        return await enterpriseRegistrationStepDao.updateRegistrationStep({
          registrationUuid,
          status: 100,
          statusText: '审核通过',
          step: 2,
          transaction
        });
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  /**
   * 设置第二步合同签署失败状态
   */
  setContractManagerFailStatus: async ({
    registrationUuid,
    managerFailText
  }) => {
    try {
      await db.transaction(async transaction => {
        return Promise.all([
          enterpriseRegistrationContractDao.updateContractManagerStatus({
            registrationUuid,
            managerFailText,
            transaction
          }),
          enterpriseRegistrationStepDao.updateRegistrationStep({
            registrationUuid,
            status: -1,
            statusText: '审核未通过',
            step: 2,
            transaction
          })
        ]);
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  /**
   * 查询第二步合同错误信息
   */
  selectContractManagerFailText: async registrationUuid => {
    return await enterpriseRegistrationContractDao.selectContractManagerFailText(
      registrationUuid
    );
  }
};
