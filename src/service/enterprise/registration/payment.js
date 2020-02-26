import { db } from '../../../db/db-connect';

import enterpriseRegistrationStepDao from '../../../dao/enterprise/enterprise-registration-step-dao';
import enterpriseRegistrationDao from '../../../dao/enterprise/enterprise-registration-dao';

// 工具类
import CustomError from '../../../util/custom-error';

export default {
  /**
   * 查询企业的缴费信息
   */
  queryRegistrationPayment: async ({ page, managerUuid }) => {
    try {
      const registrationList = await enterpriseRegistrationStepDao.queryRegistrationByManagerUuid(
        managerUuid
      );

      const uuidList = registrationList.map(item => item.uuid);

      return await enterpriseRegistrationDao.queryRegistrationPayment({
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
  updateFinanceManager: ({ registrationUuid, financeManagerUuid }) => {
    try {
      return db.transaction(async transaction => {
        const {
          currentStep
        } = await enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
          { registrationUuid, transaction }
        );
        if (currentStep !== 3) {
          throw new CustomError('当前步骤不允许更新财务人员信息!');
        }
        return await Promise.all([
          enterpriseRegistrationStepDao.updateRegistrationStep({
            registrationUuid,
            status: 2,
            statusText: '已选择财务人员',
            step: 3,
            transaction
          }),
          enterpriseRegistrationStepDao.updateRegistrationStepManagerUuid({
            registrationUuid,
            step: 3,
            managerUuid: financeManagerUuid,
            transaction
          }),
          enterpriseRegistrationDao.updateRegistrationAccountantUuid({
            registrationUuid,
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
  noticeAccountPayment: registrationUuid => {
    try {
      return db.transaction(async transaction => {
        const {
          currentStep
        } = await enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
          { registrationUuid, transaction }
        );
        if (currentStep !== 3) {
          throw new CustomError('当前步骤不允许更新支付汇款状态!');
        }
        return await enterpriseRegistrationStepDao.updateRegistrationStep({
          registrationUuid,
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
  selectRegistrationAccoutantManagerUuid: async registrationUuid => {
    try {
      return (
        await enterpriseRegistrationDao.selectRegistrationAccoutantManagerUuid(
          registrationUuid
        )
      )?.accountantManagerUuid;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 财务确认已付款
   */
  accountantConfirmPayment: registrationUuid => {
    try {
      return db.transaction(async transaction => {
        const [{ currentStep }, steps] = await Promise.all([
          enterpriseRegistrationDao.selectRegistrationCurrentStepByRegistrationUuid(
            { registrationUuid, transaction }
          ),
          enterpriseRegistrationStepDao.queryEnterpriseRegistrationStepByRegistrationUuid(
            {
              registrationUuid,
              transaction
            }
          )
        ]);

        if (currentStep !== 3 && steps[2].status !== 3) {
          throw new CustomError('当前步骤不允许更新确认收款状态!');
        }

        return await Promise.all([
          enterpriseRegistrationDao.updateRegistrationCurrentStep({
            registrationUuid,
            currentStep: 4,
            transaction
          }),
          enterpriseRegistrationStepDao.updateRegistrationStep({
            registrationUuid,
            status: 100,
            statusText: '已完成',
            step: 3,
            transaction
          }),
          enterpriseRegistrationStepDao.updateRegistrationStep({
            registrationUuid,
            status: 1,
            statusText: '未选择测试管理员',
            step: 4,
            transaction
          }),
          enterpriseRegistrationStepDao.updateRegistrationStep({
            registrationUuid,
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
