const Sequelize = require('sequelize');
const { db } = require('../db-connect');

export default db.define('enterprise_registion', {
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
  code: Sequelize.STRING(32),
  contractUuid: Sequelize.STRING(36),
  copyrightUuid: Sequelize.STRING(36),
  sepcimenUuid: Sequelize.STRING(36),
  productDescriptionUuid: Sequelize.STRING(36),
  productUuid: Sequelize.STRING(36),
  documentUuid: Sequelize.STRING(36),
  applyUuid: Sequelize.STRING(36)
});
