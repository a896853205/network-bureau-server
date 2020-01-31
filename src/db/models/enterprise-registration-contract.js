const Sequelize = require('sequelize');
const { db } = require('../db-connect');

/**
 * 评测合同
 */
export default db.define('enterprise_registration_contract', {
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
  // 3 填写错误
  statusText: Sequelize.STRING(32),
  // 以下都是企业表单内容
  amount: Sequelize.BIGINT(3), // 数量(最多999)
  fax: Sequelize.STRING(32), // 传真
  postalCode: Sequelize.STRING(32), // 邮政编码
  mainFunction: Sequelize.STRING(32), // 主要功能
  techIndex: Sequelize.STRING(32), // 技术指标
  failText: Sequelize.STRING(100), // 错误提示
});
