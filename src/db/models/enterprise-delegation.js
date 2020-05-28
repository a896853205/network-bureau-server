const Sequelize = require('sequelize');
const { db } = require('../db-connect');

const enterpriseUser = require('./enterprise-user').default;
const enterpriseDelegationBasic = require('./enterprise-delegation-basic')
  .default;
const enterpriseDelegationContract = require('./enterprise-delegation-contract')
  .default;
const enterpriseDelegationApply = require('./enterprise-delegation-apply')
  .default;
const enterpriseDelegationSpecimen = require('./enterprise-delegation-specimen')
  .default;
const enterpriseDelegationStep = require('./enterprise-delegation-step')
  .default;

const enterpriseDelegation = db.define('enterprise_delegation', {
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

enterpriseDelegation.belongsTo(enterpriseUser, {
  foreignKey: 'enterpriseUuid',
  sourceKey: 'uuid',
  as: 'enterpriseUser'
});

enterpriseDelegation.hasOne(enterpriseDelegationBasic, {
  foreignKey: 'uuid',
  sourceKey: 'uuid',
  as: 'enterpriseDelegationBasic'
});

enterpriseDelegation.hasOne(enterpriseDelegationContract, {
  foreignKey: 'uuid',
  sourceKey: 'uuid',
  as: 'enterpriseDelegationContract'
});

enterpriseDelegation.hasOne(enterpriseDelegationApply, {
  foreignKey: 'uuid',
  sourceKey: 'uuid',
  as: 'enterpriseDelegationApply'
});

enterpriseDelegation.hasOne(enterpriseDelegationSpecimen, {
  foreignKey: 'uuid',
  sourceKey: 'uuid',
  as: 'enterpriseDelegationSpecimen'
});

enterpriseDelegation.hasMany(enterpriseDelegationStep, {
  foreignKey: 'uuid',
  sourceKey: 'uuid',
  as: 'enterpriseDelegationStep'
});

export default enterpriseDelegation;