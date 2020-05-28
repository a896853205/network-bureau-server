// 登记测试的原始记录数据库
const Sequelize = require('sequelize');
const { db } = require('../db-connect');

export default db.define('enterprise_delegation_original_record', {
  id: {
    type: Sequelize.BIGINT(11),
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  uuid: {
    primaryKey: true,
    type: Sequelize.STRING(36)
  }, // 这个uuid要与enterprise-delegation的uuid一致
  status: Sequelize.BIGINT(3),
  // -1 审查不合格
  // 0 未开始
  // 1 待技术人员提交
  // 2 待技术负责人审查
  // 3 待批准人审查
  // 4 待项目管理员上传盖章之后的pdf
  failText: Sequelize.STRING(100), // 错误提示
  totalPage: Sequelize.BIGINT(3), // 页码总数
  url: Sequelize.TEXT,
  finalUrl: Sequelize.TEXT,
  techManagerUuid: Sequelize.STRING(36),
  techManagerDate: Sequelize.DATE,
  techLeaderManagerUuid: Sequelize.STRING(36),
  techLeaderManagerDate: Sequelize.DATE,
  certifierManagerUuid: Sequelize.STRING(36),
  certifierManagerDate: Sequelize.DATE,
  projectManagerUuid: Sequelize.STRING(36),
  projectManagerDate: Sequelize.DATE
});
