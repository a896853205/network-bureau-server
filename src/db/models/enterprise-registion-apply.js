const Sequelize = require('sequelize');
const { db } = require('../db-connect');

export default db.define('enterprise_registion_apply', {
  id: {
    type: Sequelize.BIGINT(11),
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  uuid: Sequelize.STRING(36),
  status: Sequelize.BIGINT(3),
  statusText: Sequelize.STRING(32),
  step: Sequelize.INTEGER,
  content: Sequelize.TEXT,
  techManagerUuid: Sequelize.STRING(36),
  techManagerDate: Sequelize.DATE,
  techLeaderManagerUuid: Sequelize.STRING(36),
  techLeaderManagerDate: Sequelize.DATE
});
