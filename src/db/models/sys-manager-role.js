const Sequelize = require('sequelize');
const { db } = require('../db-connect');

export default db.define('sys_manager_role', {
  id: {
    type: Sequelize.BIGINT(11),
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  name: Sequelize.STRING(32),  // 权限名
  code: Sequelize.STRING(32)   // 权限码
});
