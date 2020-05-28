import { db } from '../../../db/db-connect';

import enterpriseDelegationStepDao from '../../../dao/enterprise/enterprise-delegation-step-dao';
import enterpriseDelegationDao from '../../../dao/enterprise/enterprise-delegation-dao';

// 工具类
import CustomError from '../../../util/custom-error';

export default {
  /**
   * 查询企业的缴费信息
   */
  queryDelegationPayment: async ({ page, managerUuid }) => {
    try {
      const delegationList = await enterpriseDelegationStepDao.queryDelegationByManagerUuid(
        managerUuid
      );

      const uuidList = delegationList.map(item => item.uuid);

      return await enterpriseDelegationDao.queryDelegationPayment({
        page,
        uuidList
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 更新财务人员信息
   */
  updateDelegationFinanceManager: ({ delegationUuid, financeManagerUuid }) => {
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

        if (currentStep !== 3 || steps[2].status !== 1) {
          throw new CustomError('当前步骤不允许更新财务人员信息!');
        }
        return await Promise.all([
          enterpriseDelegationStepDao.updateDelegationStep({
            delegationUuid,
            status: 2,
            statusText: '已选择财务人员',
            step: 3,
            transaction
          }),
          enterpriseDelegationStepDao.updateDelegationStepManagerUuid({
            delegationUuid,
            step: 3,
            managerUuid: financeManagerUuid,
            transaction
          }),
          enterpriseDelegationDao.updateDelegationAccountantUuid({
            delegationUuid,
            accountantManagerUuid: financeManagerUuid,
            transaction
          })
        ]);
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * 更新支付汇款状态
   */
  noticeDelegationAccountPayment: delegationUuid => {
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

        if (currentStep !== 3 || steps[2].status !== 2) {
          throw new CustomError('当前步骤不允许更新支付汇款状态!');
        }
        return await enterpriseDelegationStepDao.updateDelegationStep({
          delegationUuid,
          status: 3,
          statusText: '企业点击已交款按钮',
          step: 3,
          transaction
        });
      });
    } catch (error) {
      throw error;
    }
  },
  /**
   * 查询登记测试财务管理员的uuid
   */
  selectDelegationAccoutantManagerUuid: async delegationUuid => {
    try {
      return (
        await enterpriseDelegationDao.selectDelegationAccoutantManagerUuid(
          delegationUuid
        )
      )?.accountantManagerUuid;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 财务确认已付款
   */
  accountantDelegationConfirmPayment: delegationUuid => {
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

        if (currentStep !== 3 || steps[2].status !== 3) {
          throw new CustomError('当前步骤不允许更新确认收款状态!');
        }

        return await Promise.all([
          enterpriseDelegationDao.updateDelegationCurrentStep({
            delegationUuid,
            currentStep: 4,
            transaction
          }),
          enterpriseDelegationStepDao.updateDelegationStep({
            delegationUuid,
            status: 100,
            statusText: '已完成',
            step: 3,
            transaction
          }),
          enterpriseDelegationStepDao.updateDelegationStep({
            delegationUuid,
            status: 1,
            statusText: '未选择测试管理员',
            step: 4,
            transaction
          }),
          enterpriseDelegationStepDao.updateDelegationStep({
            delegationUuid,
            status: 100,
            statusText: '已完成',
            step: 3,
            transaction
          })
        ]);
      });
    } catch (error) {
      throw error;
    }
  }
};
