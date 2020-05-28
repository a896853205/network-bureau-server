import { db } from '../../../db/db-connect';

// oss
import client from '../../../util/oss';

// dao
import enterpriseRegistrationContractDao from '../../../dao/enterprise/enterprise-registration-contract-dao';
import enterpriseRegistrationStepDao from '../../../dao/enterprise/enterprise-registration-step-dao';
import enterpriseRegistrationDao from '../../../dao/enterprise/enterprise-registration-dao';

// 工具类
import CustomError from '../../../util/custom-error';

export default {
  /**
   * 查询评测合同的基本信息
   */
  selectRegistrationContractManager: (registrationUuid) =>
    enterpriseRegistrationContractDao.selectRegistrationContractManager({
      registrationUuid,
    }),
  /**
   * 查询评测合同的url
   */
  selectContractUrl: (registrationUuid) =>
    enterpriseRegistrationContractDao.selectContractUrl({ registrationUuid }),

  /**
   * 保存评测合同的基本信息
   */
  saveRegistrationContractManager: ({
    registrationUuid,
    contractCode,
    specimenHaveTime,
    payment,
    contractTime,
  }) => {
    try {
      const paymentReg = /^(\d{1,8})$/;

      if (!contractCode.length || contractCode.length > 32) {
        throw new CustomError('合同编号长度不符合规则!');
      }

      if (!paymentReg.test(payment)) {
        throw new CustomError('评测费金额不符合规则!');
      }

      return db.transaction(async (transaction) => {
        const [registration, steps] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationStepDao.queryEnterpriseRegistrationStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
        ]);

        if (registration.currentStep !== 2 || steps[1].status !== 1) {
          throw new CustomError('当前步骤不允许保存合同信息!');
        }

        const contractList = await enterpriseRegistrationContractDao.selectRegistrationByContractCode(
          {
            contractCode,
            transaction,
          }
        );

        if (contractList && contractList?.uuid !== registrationUuid) {
          throw new CustomError('该合同编号已存在!');
        }

        return await Promise.all([
          enterpriseRegistrationContractDao.updateRegistrationContractManager(
            {
              registrationUuid,
              contractCode,
              specimenHaveTime,
              payment,
              contractTime,
              transaction,
            },
            enterpriseRegistrationStepDao.updateRegistrationStep({
              registrationUuid,
              status: 2,
              statusText: '企业上传合同',
              step: 2,
              transaction,
            })
          ),
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
      return db.transaction(async (transaction) => {
        const [registration, steps] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationStepDao.queryEnterpriseRegistrationStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
        ]);

        if (registration.currentStep !== 2 || steps[1].status !== 4) {
          throw new CustomError('当前步骤不允许保存合同信息!');
        }

        let productionUrl = '';
        // 将temp的文件copy到production中
        const [filePosition] = managerUrl.split('/');

        if (filePosition === 'temp') {
          const tempUrl = managerUrl;
          productionUrl = managerUrl.replace('temp', 'production');
          const contract = await enterpriseRegistrationContractDao.selectContractUrl(
            { registrationUuid, transaction }
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

        return Promise.all([
          enterpriseRegistrationContractDao.updateManagerContractUrl({
            registrationUuid,
            managerUrl: productionUrl,
            transaction,
          }),
          enterpriseRegistrationStepDao.updateRegistrationStep({
            registrationUuid,
            status: 100,
            statusText: '已完成',
            step: 2,
            transaction,
          }),
          enterpriseRegistrationDao.updateRegistrationCurrentStep({
            registrationUuid,
            currentStep: 3,
            transaction,
          }),
          enterpriseRegistrationStepDao.updateRegistrationStep({
            registrationUuid,
            status: 1,
            statusText: '未选择财务人员',
            step: 3,
            transaction,
          }),
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
      return db.transaction(async (transaction) => {
        const [registration, steps] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationStepDao.queryEnterpriseRegistrationStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
        ]);

        if (
          registration.currentStep !== 2 ||
          (steps[1].status !== 2 && steps[1].status !== -1)
        ) {
          throw new CustomError('当前步骤不允许保存合同信息!');
        }

        let productionUrl = '';
        // 将temp的文件copy到production中
        const [filePosition] = enterpriseUrl.split('/');

        if (filePosition === 'temp') {
          const tempUrl = enterpriseUrl;
          productionUrl = enterpriseUrl.replace('temp', 'production');
          const contract = await enterpriseRegistrationContractDao.selectContractUrl(
            {
              registrationUuid,
              transaction,
            }
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

        return Promise.all([
          enterpriseRegistrationContractDao.updateEnterpriseContractUrl({
            registrationUuid,
            enterpriseUrl: productionUrl,
            managerFailText: '',
            transaction,
          }),
          enterpriseRegistrationStepDao.updateRegistrationStep({
            status: 3,
            step: 2,
            registrationUuid,
            statusText: '审核乙方合同',
            transaction,
          }),
        ]);
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 设置第二步合同签署成功状态
   */
  setContractManagerSuccessStatus: (registrationUuid) => {
    return db.transaction(async (transaction) => {
      const [registration, steps] = await Promise.all([
        enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
          { registrationUuid, transaction }
        ),
        enterpriseRegistrationStepDao.queryEnterpriseRegistrationStepByRegistrationUuid(
          { registrationUuid, transaction }
        ),
      ]);

      if (registration.currentStep === 2 && steps[1].status === 3) {
        // return await Promise.all([
        //   enterpriseRegistrationStepDao.updateRegistrationStep({
        //     registrationUuid,
        //     status: 100,
        //     statusText: '已完成',
        //     step: 2,
        //     transaction
        //   }),
        //   enterpriseRegistrationDao.updateRegistrationCurrentStep({
        //     registrationUuid,
        //     currentStep: 3,
        //     transaction
        //   }),
        //   enterpriseRegistrationStepDao.updateRegistrationStep({
        //     registrationUuid,
        //     status: 1,
        //     statusText: '未选择财务人员',
        //     step: 3,
        //     transaction
        //   })
        // ]);
        return await enterpriseRegistrationStepDao.updateRegistrationStep({
          registrationUuid,
          status: 4,
          statusText: '管理员合同盖章上传',
          step: 2,
          transaction,
        });
      } else {
        throw new CustomError('该流程状态错误');
      }
    });
  },
  /**
   * 设置第二步合同签署失败状态
   */
  setContractManagerFailStatus: ({ registrationUuid, managerFailText }) => {
    try {
      if (!managerFailText.length || managerFailText.length > 100) {
        throw new CustomError('审核不通过理由文本长度不符合规则!');
      }

      return db.transaction(async (transaction) => {
        const [registration, steps] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationStepDao.queryEnterpriseRegistrationStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
        ]);

        if (registration.currentStep !== 2 || steps[1].status !== 3) {
          throw new CustomError('当前步骤不允许设置合同签署状态!');
        }

        return Promise.all([
          enterpriseRegistrationContractDao.updateContractManagerStatus({
            registrationUuid,
            managerFailText,
            transaction,
          }),
          enterpriseRegistrationStepDao.updateRegistrationStep({
            registrationUuid,
            status: -1,
            statusText: '审核未通过',
            step: 2,
            transaction,
          }),
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
    ),
};
