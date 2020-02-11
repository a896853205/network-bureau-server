const Sequelize = require('sequelize');
const { db } = require('../db-connect');

export default db.define('enterprise_registration_basic', {
  id: {
    type: Sequelize.BIGINT(11),
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  uuid: {
    primaryKey: true,
    type: Sequelize.STRING(36)
  }, // 这个uuid要与enterprise-registration的uuid一致
  status: Sequelize.BIGINT(3),
  statusText: Sequelize.STRING(32),
  failText: Sequelize.STRING(100), // 错误提示
  // 以下需要企业填写
  version: Sequelize.STRING(32), // 版本
  linkman: Sequelize.STRING(32), // 联系人
  client: Sequelize.STRING(32), // 委托单位(人)
  phone: Sequelize.STRING(32), // 电话(手机)
  address: Sequelize.STRING(32), // 注册地址(应与营业执照上的地址完全一致)
  enterpriseName: Sequelize.STRING(32), // 开发单位全称
  devStartTime: Sequelize.STRING(32) // 开发研发日期
});
