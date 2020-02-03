const Sequelize = require('sequelize');
const { db } = require('../db-connect');

const enterpriseUser = require('./enterprise-user').default;

const enterpriseRegistration = db.define('enterprise_registration', {
  id: {
    type: Sequelize.BIGINT(11),
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  name: Sequelize.STRING(32),
  currentStep: Sequelize.INTEGER,
  uuid: Sequelize.STRING(36),
  enterpriseUuid: Sequelize.STRING(36),
});

enterpriseRegistration.belongsTo(enterpriseUser, {
  foreignKey: 'enterpriseUuid',
  sourceKey: 'uuid',
  as: 'enterpriseUser'
});

export default enterpriseRegistration;
