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
const enterpriseRegistion = require('./models/enterprise-registion').default;
const sysRegistionStep = require('./models/sys-registion-step').default;
//const mergeEnterpriseRegistionRegistionStep = require('./models/merge-enterprise-registion-registion-step')
  //.default;
const enterpriseRegistionCopyright = require('./models/enterprise-registion-copyright')
  .default;
const enterpriseRegistionProduct = require('./models/enterprise-registion-product')
  .default;
const enterpriseRegistionProductDescription = require('./models/enterprise-registion-product-description')
  .default;
const enterpriseRegistionDocument = require('./models/enterprise-registion-document')
  .default;
const enterpriseRegistionApply = require('./models/enterprise-registion-apply')
  .default;
const enterpriseRegistionSpecimen = require('./models/enterprise-registion-specimen')
  .default;
const enterpriseRegistionContract = require('./models/enterprise-registion-contract')
  .default;

const sysRegistionStepArray = [
  {name: '提交上传7种材料', step: 1},
  {name: '电子签合同', step: 2},
  {name: '交付汇款', step: 3},
  {name: '现场测试', step: 4},
  {name: '接受原始记录和测试报告', step: 5},
  {name: '给予打分', step: 6}
]

// 企业用户表
enterpriseUser
  .sync({
    force: true
  })
  .then(() => {
    console.log('企业用户表初始化成功');
    enterpriseUser.create({
      uuid: 'guanliyuan',
      code: '91440400794618063Y',
      phone: '18507923354',
      name: '管理员',
      password: 'e10adc3949ba59abbe56e057f20f883e'
    });
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

// 企业登记注册总表
enterpriseRegistion
  .sync({
    force: true
  })
  .then(() => {
    console.log('企业登记注册总表初始化成功');
  })
  .catch(error => {
    console.error('企业登记注册总表初始化失败');
    console.error(error);
  });

// 登记注册步骤表
sysRegistionStep
  .sync({
    force: true
  })
  .then(() => {
    console.log('登记注册步骤表初始化成功');
    sysRegistionStep.bulkCreate(sysRegistionStepArray);
  })
  .catch(error => {
    console.error('登记注册步骤表初始化失败');
    console.error(error);
  });

// 企业用户登记注册的步骤表
/*mergeEnterpriseRegistionRegistionStep
  .sync({
    force: true
  })
  .then(() => {
    console.log('企业用户登记注册的步骤表初始化成功');
  });*/

// 企业用户登记注册
// 软件著作权证书表
enterpriseRegistionCopyright
  .sync({
    force: true
  })
  .then(() => {
    console.log('软件著作权证书表初始化成功');
  })
  .catch(error => {
    console.error('软件著作权证书表初始化失败');
    console.error(error);
  });

// 企业用户登记注册
// 产品介质表
enterpriseRegistionProduct
  .sync({
    force: true
  })
  .then(() => {
    console.log('产品介质表初始化成功');
  })
  .catch(error => {
    console.error('产品介质表初始化失败');
    console.error(error);
  });

// 企业用户登记注册
// 产品说明表
enterpriseRegistionProductDescription
  .sync({
    force: true
  })
  .then(() => {
    console.log('产品说明表初始化成功');
  })
  .catch(error => {
    console.error('产品说明表初始化失败');
    console.error(error);
  });

// 企业用户登记注册
// 用户文档表
enterpriseRegistionDocument
  .sync({
    force: true
  })
  .then(() => {
    console.log('用户文档表初始化成功');
  })
  .catch(error => {
    console.error('用户文档表初始化失败');
    console.error(error);
  });

// 企业用户登记注册
// 现场测试申请表
enterpriseRegistionApply
  .sync({
    force: true
  })
  .then(() => {
    console.log('现场测试申请表初始化成功');
  })
  .catch(error => {
    console.error('现场测试申请表初始化失败');
    console.error(error);
  });

// 企业用户登记注册
// 样品登记表
enterpriseRegistionSpecimen
.sync({
  force: true
})
.then(() => {
  console.log('样品登记表初始化成功');
})
.catch(error => {
  console.error('样品登记表初始化失败');
  console.error(error);
});

// 企业用户登记注册
// 评测合同
enterpriseRegistionContract
.sync({
  force: true
})
.then(() => {
  console.log('评测合同初始化成功');
})
.catch(error => {
  console.error('评测合同初始化失败');
  console.error(error);
});