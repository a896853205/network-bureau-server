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
const enterpriseRegistration = require('./models/enterprise-registration')
  .default;
const enterpriseRegistrationStep = require('./models/enterprise-registration-step')
  .default;
const sysRegistrationStep = require('./models/sys-registration-step').default;
const enterpriseRegistrationCopyright = require('./models/enterprise-registration-copyright')
  .default;
const enterpriseRegistrationProduct = require('./models/enterprise-registration-product')
  .default;
const enterpriseRegistrationProductDescription = require('./models/enterprise-registration-product-description')
  .default;
const enterpriseRegistrationDocument = require('./models/enterprise-registration-document')
  .default;
const enterpriseRegistrationApply = require('./models/enterprise-registration-apply')
  .default;
const enterpriseRegistrationSpecimen = require('./models/enterprise-registration-specimen')
  .default;
const enterpriseRegistrationContract = require('./models/enterprise-registration-contract')
  .default;
const enterpriseRegistrationBasic = require('./models/enterprise-registration-basic')
  .default;
const sequelize = require('./db-connect');

const sysRegistrationStepArray = [
  { name: '提交上传8种材料', step: 1 },
  { name: '电子签合同', step: 2 },
  { name: '交付汇款', step: 3 },
  { name: '现场测试', step: 4 },
  { name: '接受原始记录和测试报告', step: 5 },
  { name: '给予打分', step: 6 }
];

Promise.all([
  // 先创建所有数据表
  enterpriseUser.hasMany(enterpriseRegistration, {
    foreignKey: 'enterpriseUuid',
    targetKey: 'uuid'
  }),
  sequelize.db.sync({
    force: true
  })
  // enterpriseRegistration.sync({
  //   force: true
  // }),
  // enterpriseUser.sync({
  //   force: true
  // }),
  // managerUser.sync({
  //   force: true
  // }),
  // enterpriseRegistrationStep.sync({
  //   force: true
  // }),
  // sysRegistrationStep.sync({
  //   force: true
  // }),
  // enterpriseRegistrationCopyright.sync({
  //   force: true
  // }),
  // enterpriseRegistrationProduct.sync({
  //   force: true
  // }),
  // enterpriseRegistrationProductDescription.sync({
  //   force: true
  // }),
  // enterpriseRegistrationDocument.sync({
  //   force: true
  // }),
  // enterpriseRegistrationApply.sync({
  //   force: true
  // }),
  // enterpriseRegistrationSpecimen.sync({
  //   force: true
  // }),
  // enterpriseRegistrationContract.sync({
  //   force: true
  // }),
  // enterpriseRegistrationBasic.sync({
  //   force: true
  // })
])
  // .then(() =>
  //   // 创建数据关联
  //   // 企业表和企业登记测试表关联

  // )
  .then(() =>
    // 开始创建数据
    Promise.all([
      enterpriseUser.create({
        uuid: 'guanliyuan',
        code: '91440400794618063Y',
        phone: '18507923354',
        name: '管理员',
        password: 'e10adc3949ba59abbe56e057f20f883e'
      }),
      managerUser.create({
        username: 'admin',
        uuid: 'woshiguanliyuanceshizhanghao',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        role: 1,
        name: '超级管理员',
        phone: '15998133472',
        star: 5
      }),
      managerUser.create({
        username: 'xiangmu',
        uuid: 'woshiyigexiangmuguanliyuan',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        role: 10,
        name: '项目管理员',
        phone: '15998133472',
        star: 5
      }),
      sysRegistrationStep.bulkCreate(sysRegistrationStepArray)
    ])
  )
  .then(() => {
    console.log('===数据库初始化成功===');
  })
  .catch(err => {
    console.error('数据库初始化出错啦', err);
  });
