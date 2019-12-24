require('babel-register')({
  presets: [
    [
      'env',
      {
        targets: {
          node: '12.13.1'
        }
      }
    ]
  ]
});

const enterpriseUser = require('./models/enterprise-user').default;
const managerUser = require('./models/manager-user').default;
const registrationBasic = require('./models/registration-basic').default;
const enterpriseRegistion = require('./models/enterprise_registion').default;

// 企业用户表
enterpriseUser
  .sync({
    force: true
  })
  .then(() => {
    console.log('企业用户表初始化成功');
  })
  .catch(error => {
    console.error('企业用户表初始化失败');
    console.error(error);
  });

// 管理员用户表
managerUser
  .sync({
    force: true
  })
  .then(() => {
    console.log('管理员用户表初始化成功');
    managerUser.create({
      username: 'admin',
      uuid: 'woshiguanliyuanceshizhanghao',
      password: 'e10adc3949ba59abbe56e057f20f883e',
      role: 1,
      name: '超级管理员',
      phone: '15998133472'
    });
    console.log('生成了一个管理员');
  })
  .catch(error => {
    console.error('管理员用户表初始化失败');
    console.error(error);
  });

// 登记注册基本表
registrationBasic
  .sync({
    force: true
  })
  .then(() => {
    console.log('登记注册基本表初始化成功');
  });

// 企业登记注册表
enterpriseRegistion
  .sync({
    force: true
  })
  .then(() => {
    console.log('企业登记注册表初始化成功');
  });
