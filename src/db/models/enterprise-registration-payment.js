const Sequelize = require('sequelize');
const { db } = require('../db-connect');

/**
 * 登记测试缴费信息
 */
export default db.define('enterprise_registration_payment', {
  id: {
    type: Sequelize.BIGINT(11),
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  uuid: Sequelize.STRING(36), // 这个uuid要与enterprise-registration的uuid一致
  status: Sequelize.BIGINT(3),
  // 1 是未选择财务人员
  // 2 已选择财务人员
  // 3 企业点击已交款按钮
  // 4 财务点击了确认按钮, 结束
});
