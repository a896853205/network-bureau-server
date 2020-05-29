import { db } from '../../../db/db-connect';

// oss
import client from '../../../util/oss';

// dao
import enterpriseDelegationContractDao from '../../../dao/enterprise/enterprise-delegation-contract-dao';
import enterpriseDelegationStepDao from '../../../dao/enterprise/enterprise-delegation-step-dao';
import enterpriseDelegationDao from '../../../dao/enterprise/enterprise-delegation-dao';

// 工具类
import CustomError from '../../../util/custom-error';

export default {
  /**
   * 查询评测合同的基本信息
   */
  selectDelegationContractManager: (delegationUuid) =>
    enterpriseDelegationContractDao.selectDelegationContractManager({
      delegationUuid,
    }),
  /**
   * 查询评测合同的url
   */
  selectDelegationContractUrl: (delegationUuid) =>
    enterpriseDelegationContractDao.selectDelegationContractUrl({ delegationUuid }),

  /**
   * 保存评测合同的基本信息
   */
  saveDelegationContractManager: ({
    delegationUuid,
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
        const [delegation, steps] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationStepDao.queryEnterpriseDelegationStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
        ]);

        if (delegation.currentStep !== 2 || steps[1].status !== 1) {
          throw new CustomError('当前步骤不允许保存合同信息!');
        }

        const contractList = await enterpriseDelegationContractDao.selectDelegationByContractCode(
          {
            contractCode,
            transaction,
          }
        );

        if (contractList && contractList?.uuid !== delegationUuid) {
          throw new CustomError('该合同编号已存在!');
        }

        return await Promise.all([
          enterpriseDelegationContractDao.updateDelegationContractManager(
            {
              delegationUuid,
              contractCode,
              specimenHaveTime,
              payment,
              contractTime,
              transaction,
            },
            enterpriseDelegationStepDao.updateDelegationStep({
              delegationUuid,
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
  saveDelegationManagerContractUrl: async ({ delegationUuid, managerUrl }) => {
    try {
      return db.transaction(async (transaction) => {
        const [delegation, steps] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationStepDao.queryEnterpriseDelegationStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
        ]);

        if (delegation.currentStep !== 2 || steps[1].status !== 4) {
          throw new CustomError('当前步骤不允许保存合同信息!');
        }

        let productionUrl = '';
        // 将temp的文件copy到production中
        const [filePosition] = managerUrl.split('/');

        if (filePosition === 'temp') {
          const tempUrl = managerUrl;
          productionUrl = managerUrl.replace('temp', 'production');
          const contract = await enterpriseDelegationContractDao.selectDelegationContractUrl(
            { delegationUuid, transaction }
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
          enterpriseDelegationContractDao.updateDelegationManagerContractUrl({
            delegationUuid,
            managerUrl: productionUrl,
            transaction,
          }),
          enterpriseDelegationStepDao.updateDelegationStep({
            delegationUuid,
            status: 100,
            statusText: '已完成',
            step: 2,
            transaction,
          }),
          enterpriseDelegationDao.updateDelegationCurrentStep({
            delegationUuid,
            currentStep: 3,
            transaction,
          }),
          enterpriseDelegationStepDao.updateDelegationStep({
            delegationUuid,
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
  saveDelegationEnterpriseContractUrl: async ({ delegationUuid, enterpriseUrl }) => {
    try {
      return db.transaction(async (transaction) => {
        const [delegation, steps] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationStepDao.queryEnterpriseDelegationStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
        ]);

        if (
          delegation.currentStep !== 2 ||
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
          const contract = await enterpriseDelegationContractDao.selectDelegationContractUrl(
            {
              delegationUuid,
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
          enterpriseDelegationContractDao.updateDelegationEnterpriseContractUrl({
            delegationUuid,
            enterpriseUrl: productionUrl,
            managerFailText: '',
            transaction,
          }),
          enterpriseDelegationStepDao.updateDelegationStep({
            status: 3,
            step: 2,
            delegationUuid,
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
  setDelegationContractManagerSuccessStatus: (delegationUuid) => {
    return db.transaction(async (transaction) => {
      const [delegation, steps] = await Promise.all([
        enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
          { delegationUuid, transaction }
        ),
        enterpriseDelegationStepDao.queryEnterpriseDelegationStepByDelegationUuid(
          { delegationUuid, transaction }
        ),
      ]);

      if (delegation.currentStep === 2 && steps[1].status === 3) {
        // return await Promise.all([
        //   enterpriseDelegationStepDao.updateDelegationStep({
        //     delegationUuid,
        //     status: 100,
        //     statusText: '已完成',
        //     step: 2,
        //     transaction
        //   }),
        //   enterpriseDelegationDao.updateDelegationCurrentStep({
        //     delegationUuid,
        //     currentStep: 3,
        //     transaction
        //   }),
        //   enterpriseDelegationStepDao.updateDelegationStep({
        //     delegationUuid,
        //     status: 1,
        //     statusText: '未选择财务人员',
        //     step: 3,
        //     transaction
        //   })
        // ]);
        return await enterpriseDelegationStepDao.updateDelegationStep({
          delegationUuid,
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
  setDelegationContractManagerFailStatus: ({ delegationUuid, managerFailText }) => {
    try {
      if (!managerFailText.length || managerFailText.length > 100) {
        throw new CustomError('审核不通过理由文本长度不符合规则!');
      }

      return db.transaction(async (transaction) => {
        const [delegation, steps] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationStepDao.queryEnterpriseDelegationStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
        ]);

        if (delegation.currentStep !== 2 || steps[1].status !== 3) {
          throw new CustomError('当前步骤不允许设置合同签署状态!');
        }

        return Promise.all([
          enterpriseDelegationContractDao.updateDelegationContractManagerStatus({
            delegationUuid,
            managerFailText,
            transaction,
          }),
          enterpriseDelegationStepDao.updateDelegationStep({
            delegationUuid,
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
  selectDelegationContractManagerFailText: delegationUuid =>
    enterpriseDelegationContractDao.selectDelegationContractManagerFailText(
      delegationUuid
    ),

 // 委托合同

    /**
   * 查询评测合同的基本信息
   */
  selectDelegationContractManager: (delegationUuid) =>
    enterpriseDelegationContractDao.selectDelegationContractManager({
      delegationUuid,
    }),
  /**
   * 查询评测合同的url
   */
  selectDelegationContractUrl: (delegationUuid) =>
    enterpriseDelegationContractDao.selectDelegationContractUrl({ delegationUuid }),

  /**
   * 保存评测合同的基本信息
   */
  saveDelegationContractManager: ({
    delegationUuid,
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
        const [delegation, steps] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationStepDao.queryEnterpriseDelegationStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
        ]);

        if (delegation.currentStep !== 2 || steps[1].status !== 1) {
          throw new CustomError('当前步骤不允许保存合同信息!');
        }

        const contractList = await enterpriseDelegationContractDao.selectDelegationByContractCode(
          {
            contractCode,
            transaction,
          }
        );

        if (contractList && contractList?.uuid !== delegationUuid) {
          throw new CustomError('该合同编号已存在!');
        }

        return await Promise.all([
          enterpriseDelegationContractDao.updateDelegationContractManager(
            {
              delegationUuid,
              contractCode,
              specimenHaveTime,
              payment,
              contractTime,
              transaction,
            },
            enterpriseDelegationStepDao.updateDelegationStep({
              delegationUuid,
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
  saveDelegationManagerContractUrl: async ({ delegationUuid, managerUrl }) => {
    try {
      return db.transaction(async (transaction) => {
        const [delegation, steps] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationStepDao.queryEnterpriseDelegationStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
        ]);

        if (delegation.currentStep !== 2 || steps[1].status !== 4) {
          throw new CustomError('当前步骤不允许保存合同信息!');
        }

        let productionUrl = '';
        // 将temp的文件copy到production中
        const [filePosition] = managerUrl.split('/');

        if (filePosition === 'temp') {
          const tempUrl = managerUrl;
          productionUrl = managerUrl.replace('temp', 'production');
          const contract = await enterpriseDelegationContractDao.selectDelegationContractUrl(
            { delegationUuid, transaction }
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
          enterpriseDelegationContractDao.updateDelegationManagerContractUrl({
            delegationUuid,
            managerUrl: productionUrl,
            transaction,
          }),
          enterpriseDelegationStepDao.updateDelegationStep({
            delegationUuid,
            status: 100,
            statusText: '已完成',
            step: 2,
            transaction,
          }),
          enterpriseDelegationDao.updateDelegationCurrentStep({
            delegationUuid,
            currentStep: 3,
            transaction,
          }),
          enterpriseDelegationStepDao.updateDelegationStep({
            delegationUuid,
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
  saveDelegationEnterpriseContractUrl: async ({ delegationUuid, enterpriseUrl }) => {
    try {
      return db.transaction(async (transaction) => {
        const [delegation, steps] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationStepDao.queryEnterpriseDelegationStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
        ]);

        if (
          delegation.currentStep !== 2 ||
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
          const contract = await enterpriseDelegationContractDao.selectDelegationContractUrl(
            {
              delegationUuid,
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
          enterpriseDelegationContractDao.updateDelegationEnterpriseContractUrl({
            delegationUuid,
            enterpriseUrl: productionUrl,
            managerFailText: '',
            transaction,
          }),
          enterpriseDelegationStepDao.updateDelegationStep({
            status: 3,
            step: 2,
            delegationUuid,
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
  setDelegationContractManagerSuccessStatus: (delegationUuid) => {
    return db.transaction(async (transaction) => {
      const [delegation, steps] = await Promise.all([
        enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
          { delegationUuid, transaction }
        ),
        enterpriseDelegationStepDao.queryEnterpriseDelegationStepByDelegationUuid(
          { delegationUuid, transaction }
        ),
      ]);

      if (delegation.currentStep === 2 && steps[1].status === 3) {
        // return await Promise.all([
        //   enterpriseDelegationStepDao.updateDelegationStep({
        //     delegationUuid,
        //     status: 100,
        //     statusText: '已完成',
        //     step: 2,
        //     transaction
        //   }),
        //   enterpriseDelegationDao.updateDelegationCurrentStep({
        //     delegationUuid,
        //     currentStep: 3,
        //     transaction
        //   }),
        //   enterpriseDelegationStepDao.updateDelegationStep({
        //     delegationUuid,
        //     status: 1,
        //     statusText: '未选择财务人员',
        //     step: 3,
        //     transaction
        //   })
        // ]);
        return await enterpriseDelegationStepDao.updateDelegationStep({
          delegationUuid,
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
  setDelegationContractManagerFailStatus: ({ delegationUuid, managerFailText }) => {
    try {
      if (!managerFailText.length || managerFailText.length > 100) {
        throw new CustomError('审核不通过理由文本长度不符合规则!');
      }

      return db.transaction(async (transaction) => {
        const [delegation, steps] = await Promise.all([
          enterpriseDelegationDao.selectDelegationCurrentStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
          enterpriseDelegationStepDao.queryEnterpriseDelegationStepByDelegationUuid(
            { delegationUuid, transaction }
          ),
        ]);

        if (delegation.currentStep !== 2 || steps[1].status !== 3) {
          throw new CustomError('当前步骤不允许设置合同签署状态!');
        }

        return Promise.all([
          enterpriseDelegationContractDao.updateDelegationContractManagerStatus({
            delegationUuid,
            managerFailText,
            transaction,
          }),
          enterpriseDelegationStepDao.updateDelegationStep({
            delegationUuid,
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
  selectDelegationContractManagerFailText: (delegationUuid) =>
    enterpriseDelegationContractDao.selectDelegationContractManagerFailText(
      delegationUuid
    ),
};
