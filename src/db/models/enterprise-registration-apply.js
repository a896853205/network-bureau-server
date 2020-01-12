const Sequelize = require('sequelize');
const { db } = require('../db-connect');

/**
 * 现场测试申请表
 */
export default db.define('enterprise_registration_apply', {
  id: {
    type: Sequelize.BIGINT(11),
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  uuid: Sequelize.STRING(36), // 这个uuid要与enterprise-registration的uuid一致
  status: Sequelize.BIGINT(3),
  statusText: Sequelize.STRING(32),
  step: Sequelize.INTEGER,
  content: Sequelize.TEXT,
  techManagerUuid: Sequelize.STRING(36),
  techManagerDate: Sequelize.DATE,
  techLeaderManagerUuid: Sequelize.STRING(36),
  techLeaderManagerDate: Sequelize.DATE
});
