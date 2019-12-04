const Sequelize = require('sequelize');
const { db } = require('../db-connect');

export default db.define('enterpriseUser', {
  id: {
    type: Sequelize.BIGINT(11),
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  code: Sequelize.STRING(32),
  uuid: Sequelize.STRING(32),
  phone: Sequelize.STRING(32),
  password: Sequelize.STRING(32),
  name: Sequelize.STRING(32)
});
