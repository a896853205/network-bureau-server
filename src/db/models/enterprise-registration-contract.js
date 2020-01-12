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
  statusText: Sequelize.STRING(32)
});