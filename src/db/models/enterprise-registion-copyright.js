const Sequelize = require('sequelize');
const { db } = require('../db-connect');

/**
 * 软件著作权证书
 */
export default db.define('enterprise_registion_copyright', {
  id: {
    type: Sequelize.BIGINT(11),
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  uuid: Sequelize.STRING(36), // 这个uuid要与enterprise-registion的uuid一致
  status: Sequelize.BIGINT(3),
  statusText: Sequelize.STRING(32),
  url: Sequelize.TEXT
});
