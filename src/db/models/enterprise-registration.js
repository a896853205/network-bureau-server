const Sequelize = require('sequelize');
const { db } = require('../db-connect');

const enterpriseUser = require('./enterprise-user').default;
const enterpriseRegistrationBasic = require('./enterprise-registration-basic')
  .default;
const enterpriseRegistrationContract = require('./enterprise-registration-contract')
  .default;
const enterpriseRegistrationApply = require('./enterprise-registration-apply')
  .default;
const enterpriseRegistrationSpecimen = require('./enterprise-registration-specimen')
  .default;
const enterpriseRegistrationStep = require('./enterprise-registration-step')
  .default;

const enterpriseRegistration = db.define('enterprise_registration', {
  id: {
    type: Sequelize.BIGINT(11),
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  name: Sequelize.STRING(32),
  currentStep: Sequelize.INTEGER,
  uuid: {
    primaryKey: true,
    type: Sequelize.STRING(36)
  },
  enterpriseUuid: Sequelize.STRING(36),
  projectManagerUuid: Sequelize.STRING(36), // 项目管理人员
  techLeaderManagerUuid: Sequelize.STRING(36), // 技术负责人
  techManagerUuid: Sequelize.STRING(36), // 技术人员
  certifierManagerUuid: Sequelize.STRING(36), // 批准人
  accountantManagerUuid: Sequelize.STRING(36) // 财务
});

enterpriseRegistration.belongsTo(enterpriseUser, {
  foreignKey: 'enterpriseUuid',
  sourceKey: 'uuid',
  as: 'enterpriseUser'
});

enterpriseRegistration.hasOne(enterpriseRegistrationBasic, {
  foreignKey: 'uuid',
  sourceKey: 'uuid',
  as: 'enterpriseRegistrationBasic'
});

enterpriseRegistration.hasOne(enterpriseRegistrationContract, {
  foreignKey: 'uuid',
  sourceKey: 'uuid',
  as: 'enterpriseRegistrationContract'
});

enterpriseRegistration.hasOne(enterpriseRegistrationApply, {
  foreignKey: 'uuid',
  sourceKey: 'uuid',
  as: 'enterpriseRegistrationApply'
});

enterpriseRegistration.hasOne(enterpriseRegistrationSpecimen, {
  foreignKey: 'uuid',
  sourceKey: 'uuid',
  as: 'enterpriseRegistrationSpecimen'
});

enterpriseRegistration.hasMany(enterpriseRegistrationStep, {
  foreignKey: 'uuid',
  sourceKey: 'uuid',
  as: 'enterpriseRegistrationStep'
});

export default enterpriseRegistration;
