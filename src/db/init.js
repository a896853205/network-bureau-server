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
const sysRegistionStep = require('./models/sys_registion_step').default;
const mergeEnterpriseRegistionRegistionStep = require('./models/merge_enterprise_registion_registion_step').default;
const enterpriseRegistionCopyright = require('./models/enterprise_registion_copyright').default;
const enterpriseRegistionProduct = require('./models/enterprise_registion_product').default;
const enterpriseRegistionProductDescription = require('./models/enterprise_registion_product_description').default;
const enterpriseRegistionDocument = require('./models/enterprise_registion_document').default;
const enterpriseRegistionApply = require('./models/enterprise_registion_apply').default;

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

// 企业登记注册总表
enterpriseRegistion
  .sync({
    force: true
  })
  .then(() => {
    console.log('企业登记注册总表初始化成功');
  });

// 登记注册步骤表
sysRegistionStep
  .sync({
    force: true
  })
  .then(() => {
    console.log('登记注册步骤表初始化成功');
  });

//企业用户登记注册的步骤表
mergeEnterpriseRegistionRegistionStep
  .sync({
    force: true
  })
  .then(() => {
    console.log('企业用户登记注册的步骤表初始化成功');
  });

// 企业用户登记注册
//软件著作权证书表
enterpriseRegistionCopyright
.sync({
  force: true
})
.then(() => {
  console.log('软件著作权证书表初始化成功');
});

// 企业用户登记注册
//产品介质表
enterpriseRegistionProduct
  .sync({
    force: true
  })
  .then(() => {
    console.log('产品介质表初始化成功');
  });

// 企业用户登记注册
//产品说明表
enterpriseRegistionProductDescription
  .sync({
    force: true
  })
  .then(() => {
    console.log('产品说明表初始化成功');
  });

// 企业用户登记注册
//用户文档表
enterpriseRegistionDocument
  .sync({
    force: true
  })
  .then(() => {
    console.log('用户文档表初始化成功');
  });

// 企业用户登记注册
//现场测试申请表
enterpriseRegistionApply
  .sync({
    force: true
  })
  .then(() => {
    console.log('现场测试申请表初始化成功');
  });