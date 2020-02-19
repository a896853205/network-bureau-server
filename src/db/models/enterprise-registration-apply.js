const Sequelize = require('sequelize');
const { db } = require('../db-connect');

/**
 * 现场测试申请表
 */
export default db.define('enterprise_registration_apply', {
  id: {
    type: Sequelize.BIGINT(11),
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  uuid: {
    primaryKey: true,
    type: Sequelize.STRING(36)
  }, // 这个uuid要与enterprise-registration的uuid一致
  status: Sequelize.BIGINT(3),
  statusText: Sequelize.STRING(32),
  step: Sequelize.INTEGER,
  failText: Sequelize.STRING(100), // 错误提示
  content: Sequelize.TEXT, // 内容
  techManagerUuid: Sequelize.STRING(36),
  techManagerDate: Sequelize.DATE,
  techLeaderManagerUuid: Sequelize.STRING(36),
  techLeaderManagerDate: Sequelize.DATE,
  certifierManagerUuid: Sequelize.STRING(36),
  certifierManagerDate: Sequelize.DATE,
  managerStatus: Sequelize.BIGINT(3),
  // -1 技术人员审查企业提交信息不合格
  // -2 项目管理员审查技术人员不合格
  // -3 批准人审查项目管理人员不合格
  // 1 待技术人员确认
  // 2 待项目管理员确认
  // 3 待批准人确认
  // 100 已完成
  failManagerText: Sequelize.STRING(100)
  // 审查表时候错误信息
});
