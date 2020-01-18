const Sequelize = require('sequelize');
const { db } = require('../db-connect');

/**
 * 评测合同
 */
export default db.define('enterprise_registration_contract', {
  id: {
    type: Sequelize.BIGINT(11),
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  uuid: Sequelize.STRING(36), // 这个uuid要与enterprise-registration的uuid一致
  status: Sequelize.BIGINT(3), 
  // 0 未填写
  // 1 已填写 待审核
  // 2 已审核
  statusText: Sequelize.STRING(32),
  // 以下都是企业表单内容
  version: Sequelize.STRING(36), // 版本
  amount: Sequelize.BIGINT(3), // 数量(最多999)
  fax: Sequelize.STRING(32), // 传真
  linkman: Sequelize.STRING(32), // 联系人
  client: Sequelize.STRING(32), // 委托单位(人)
  phone: Sequelize.STRING(32), // 电话(手机)
  address: Sequelize.STRING(32), // 注册地址(应与营业执照上的地址完全一致)
  postalCode: Sequelize.STRING(32), // 邮政编码
  enterpriseName: Sequelize.STRING(32), // 开发单位全称
  devStartTime: Sequelize.STRING(32), // 开发研发日期
  mainFunction: Sequelize.STRING(32), // 主要功能
  techIndex: Sequelize.STRING(32), // 技术指标
});
