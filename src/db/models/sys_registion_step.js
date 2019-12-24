const Sequelize = require('sequelize');
const { db } = require('../db-connect');

export default db.define('sys_registion_step', {
  id: {
    type: Sequelize.BIGINT(11),
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  name: Sequelize.STRING(32),
  step: Sequelize.INTEGER
});
