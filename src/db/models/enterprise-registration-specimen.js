const Sequelize = require('sequelize');
const { db } = require('../db-connect');

/**
 * 样品登记表
 */
export default db.define('enterprise_registration_specimen', {
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
  // 0 未填写
  // 1 已填写 待审核
  // 2 已审核
  statusText: Sequelize.STRING(32),
  trademark: Sequelize.STRING(32), // 注册商标
  developmentTool: Sequelize.STRING(32), // 开发工具
  securityClassification: Sequelize.BIGINT(1), // 产品密级(0 无, 1 有)
  email: Sequelize.STRING(32), // 邮箱
  unit: Sequelize.STRING(32), // 单位属性(独立科研单位, 大专院校, 国有企业, 责任公司, 集体个体, 其他性质)
  techManagerUuid: Sequelize.STRING(36),
  techManagerDate: Sequelize.DATE,
  projectManagerUuid: Sequelize.STRING(36),
  projectManagerDate: Sequelize.DATE,
  failText: Sequelize.STRING(100), // 错误提示
  managerStatus: Sequelize.BIGINT(3),
  // -1 技术人员审查企业提交信息不合格
  // -2 项目管理员审查技术人员不合格
  // 1 待技术人员确认
  // 2 待项目管理员确认
  // 100 已完成
  failManagerText: Sequelize.STRING(100)
  // 审查表时候错误信息
});
