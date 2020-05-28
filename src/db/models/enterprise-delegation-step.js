const Sequelize = require('sequelize');
const { db } = require('../db-connect');

export default db.define('enterprise_delegation_step', {
  id: {
    type: Sequelize.BIGINT(11),
    allowNull: false,
    unique: true,
    autoIncrement: true,
    primaryKey: true
  },
  uuid: Sequelize.STRING(36), // 这个uuid要与enterprise-delegation的uuid一致
  step: Sequelize.BIGINT(3), // 步骤数
  status: Sequelize.BIGINT(3),
  // 未开始     0 灰色
  // 正在填写   1 蓝色
  // 正在审核   2 蓝色
  // 成功     100 绿色
  // 错误      -1 红色
  statusText: Sequelize.STRING(32),
  managerUuid: Sequelize.STRING(36) // 负责的管理员的uuid,普通的步骤在创建的时候就将(查询)项目负责人的uuid给,后面的是项目负责人派发的时候将这个字段改变
});

// 电子签合同
// -1 审核未通过 红
// 0 未开始 灰色
// 1 管理员填写内容 蓝
// 2 管理员生成合同 蓝
// 3 企业上传合同 蓝
// 4 审核最终合同 蓝
// 5 审核通过 蓝
// 100 合同签署成功 绿

// 现场测试
// 0 未开始 灰色
// 1 待选择技术负责人
// 2 待技术负责人选择技术人员
// 3 待软件评测登记表和软件评测现场测试申请表审查流程完成
// 4 待报告和原始记录流程完成
// 100 完成 绿