const Sequelize = require('sequelize');
const { db } = require('../db-connect');

/**
 * 样品登记表
 */
export default db.define('enterprise_registration_specimen', {
  id: {
    type: Sequelize.BIGINT(11),
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  uuid: Sequelize.STRING(36), // 这个uuid要与enterprise-registration的uuid一致
  status: Sequelize.BIGINT(3),
  // 0 未填写
  // 1 已填写 待审核
  // 2 已审核
  statusText: Sequelize.STRING(32)
});
