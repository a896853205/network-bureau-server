const Sequelize = require('sequelize');
const { db } = require('../db-connect');

/**
 * 样品登记表
 */
export default db.define('enterprise_registion_specimen', {
  id: {
    type: Sequelize.BIGINT(11),
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  uuid: Sequelize.STRING(36), // 这个uuid要与enterprise-registion的uuid一致
  status: Sequelize.BIGINT(3),
  statusText: Sequelize.STRING(32)
});
