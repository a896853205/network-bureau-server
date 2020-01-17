const Sequelize = require('sequelize');
const { db } = require('../db-connect');

export default db.define('manager_user', {
  id: {
    type: Sequelize.BIGINT(11),
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true
  },
  username: Sequelize.STRING(32), // 用户名
  uuid: Sequelize.STRING(36),
  phone: Sequelize.STRING(32),
  password: Sequelize.STRING(32),
  name: Sequelize.STRING(32),
  role: Sequelize.BIGINT(3), // 权限
  headPortraitUrl: Sequelize.STRING(50), // 头像ossUrl
  star: Sequelize.BIGINT(2), // 星级
});
