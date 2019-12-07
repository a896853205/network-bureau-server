const Sequelize = require('sequelize');
const { db } = require('../db-connect');

export default db.define('enterprise_user', {
  id: {
    type: Sequelize.BIGINT(11),
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  code: Sequelize.STRING(32),
  uuid: Sequelize.STRING(36),
  phone: Sequelize.STRING(32),
  password: Sequelize.STRING(32),
  name: Sequelize.STRING(32)
});
