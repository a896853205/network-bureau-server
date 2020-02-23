import { db } from '../../../db/db-connect';

import enterpriseRegistrationStepDao from '../../../dao/enterprise/enterprise-registration-step-dao';
import enterpriseRegistrationDao from '../../../dao/enterprise/enterprise-registration-dao';

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
      return db.transaction(transaction => {
        return Promise.all([
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
  noticeAccountPayment: registrationUuid =>
    enterpriseRegistrationStepDao.updateRegistrationStep({
      registrationUuid,
      status: 3,
      statusText: '企业点击已交款按钮',
      step: 3
    }),

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
  accountantConfirmPayment: registrationUuid =>
    enterpriseRegistrationStepDao.updateRegistrationStep({
      registrationUuid,
      status: 4,
      statusText: '财务已确认收款',
      step: 3
    })
};
