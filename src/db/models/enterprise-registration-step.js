const Sequelize = require('sequelize');
const { db } = require('../db-connect');

export default db.define('enterprise_registration_step', {
  id: {
    type: Sequelize.BIGINT(11),
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  uuid: Sequelize.STRING(36), // 这个uuid要与enterprise-registration的uuid一致
  step: Sequelize.BIGINT(3),  // 步骤数
  status: Sequelize.BIGINT(3),
  // 未开始     1 灰色
  // 正在进行   2 黄色
  // 成功       3 绿色
  // 错误       4 红色
  statusText: Sequelize.STRING(32),
  managerUuid: Sequelize.STRING(36) // 负责的管理员的uuid,普通的步骤在创建的时候就将(查询)项目负责人的uuid给,后面的是项目负责人派发的时候将这个字段改变
});
