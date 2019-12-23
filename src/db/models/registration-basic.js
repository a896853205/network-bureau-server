const Sequelize = require('sequelize');
const { db } = require('../db-connect');

export default db.define('registration_basic', {
  id: {
    type: Sequelize.BIGINT(11),
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  uuid: Sequelize.STRING(36),
  name: Sequelize.STRING(32),  // 登记测试产品名称
  step: Sequelize.INTEGER    // 步骤
})