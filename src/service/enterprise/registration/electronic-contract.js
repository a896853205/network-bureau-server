import { db } from '../../../db/db-connect';

// oss
import client from '../../../util/oss';

// dao
import enterpriseRegistrationContractDao from '../../../dao/enterprise/enterprise-registration-contract-dao';
import enterpriseRegistrationStepDao from '../../../dao/enterprise/enterprise-registration-step-dao';

// 工具类
import CustomError from '../../../util/custom-error';

export default {
  /**
   * 查询评测合同的基本信息
   */
  selectRegistrationContractManager: registrationUuid =>
    enterpriseRegistrationContractDao.selectRegistrationContractManager(
      registrationUuid
    ),
  /**
   * 查询评测合同的url
   */
  selectContractUrl: registrationUuid =>
    enterpriseRegistrationContractDao.selectContractUrl(registrationUuid),

  /**
   * 保存评测合同的基本信息
   */
  saveRegistrationContractManager: ({
    registrationUuid,
    contractCode,
    specimenHaveTime,
    payment,
    paymentTime,
    contractTime
  }) => {
    try {
      return db.transaction(transaction => {
        return Promise.all([
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
        ]);
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 保存评测合同甲方上传pdf合同的信息
   */
  saveManagerContractUrl: async ({ registrationUuid, managerUrl }) => {
    try {
      let productionUrl = '';
      // 将temp的文件copy到production中
      const [filePosition] = managerUrl.split('/');

      if (filePosition === 'temp') {
        const tempUrl = managerUrl;
        productionUrl = managerUrl.replace('temp', 'production');
        const contract = await enterpriseRegistrationContractDao.selectContractUrl(
          registrationUuid
        );

        if (contract?.url) {
          await client.delete(contract.url);
        }

        await client.copy(productionUrl, tempUrl);
      } else if (filePosition === 'production') {
        productionUrl = managerUrl;
      } else {
        throw new CustomError('oss文件路径错误');
      }

      await db.transaction(transaction => {
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
    } catch (error) {
      throw error;
    }
  },

  /**
   * 保存评测合同乙方上传pdf合同的信息
   */
  saveEnterpriseContractUrl: async ({ registrationUuid, enterpriseUrl }) => {
    try {
      let productionUrl = '';
      // 将temp的文件copy到production中
      const [filePosition] = enterpriseUrl.split('/');

      if (filePosition === 'temp') {
        const tempUrl = enterpriseUrl;
        productionUrl = enterpriseUrl.replace('temp', 'production');
        const contract = await enterpriseRegistrationContractDao.selectContractUrl(
          registrationUuid
        );

        if (contract?.url) {
          await client.delete(contract.url);
        }

        await client.copy(productionUrl, tempUrl);
      } else if (filePosition === 'production') {
        productionUrl = enterpriseUrl;
      } else {
        throw new CustomError('oss文件路径错误');
      }

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
    } catch (error) {
      throw error;
    }
  },

  /**
   * 设置第二步合同签署成功状态
   */
  setContractManagerSuccessStatus: registrationUuid =>
    enterpriseRegistrationStepDao.updateRegistrationStep({
      registrationUuid,
      status: 100,
      statusText: '审核通过',
      step: 2
    }),
  /**
   * 设置第二步合同签署失败状态
   */
  setContractManagerFailStatus: ({ registrationUuid, managerFailText }) => {
    try {
      return db.transaction(transaction => {
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
    } catch (error) {
      throw error;
    }
  },

  /**
   * 查询第二步合同错误信息
   */
  selectContractManagerFailText: registrationUuid =>
    enterpriseRegistrationContractDao.selectContractManagerFailText(
      registrationUuid
    )
};
