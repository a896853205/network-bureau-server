const Sequelize = require('sequelize');
const { db } = require('../db-connect');

export default db.define('merge_enterprise_registion_registion_step', {
  id: {
    type: Sequelize.BIGINT(11),
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  uuid: Sequelize.STRING(36),
  step: Sequelize.INTEGER,
  status: Sequelize.BIGINT(3),
  statusText: Sequelize.STRING(32)
});
