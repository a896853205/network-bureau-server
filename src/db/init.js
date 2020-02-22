require('@babel/register')({
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '12.13.1'
        }
      }
    ]
  ],
  plugins: ['@babel/plugin-proposal-optional-chaining']
});

const enterpriseUser = require('./models/enterprise-user').default;
const managerUser = require('./models/manager-user').default;
const sysRegistrationStep = require('./models/sys-registration-step').default;
require('./models/enterprise-registration').default;
require('./models/enterprise-registration-step').default;
require('./models/enterprise-registration-copyright').default;
require('./models/enterprise-registration-product').default;
require('./models/enterprise-registration-product-description').default;
require('./models/enterprise-registration-document').default;
require('./models/enterprise-registration-apply').default;
require('./models/enterprise-registration-specimen').default;
require('./models/enterprise-registration-contract').default;
require('./models/enterprise-registration-basic').default;
require('./models/enterprise-registration-original-record').default;
require('./models/enterprise-registration-report').default;
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
  sequelize.db.sync({
    force: true
  })
])
  .then(() =>
    // 开始创建数据
    Promise.all([
      enterpriseUser.create({
        uuid: 'guanliyuan',
        code: '91440400794618063Y',
        phone: '18507923354',
        name: '企业',
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
      managerUser.create({
        username: 'jishuguanli',
        uuid: 'jishuguanli',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        role: 15,
        name: '技术管理员',
        phone: '15998133472',
        star: 5
      }),
      managerUser.create({
        username: 'jishu',
        uuid: 'jishu',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        role: 20,
        name: '技术人员',
        phone: '15998133472',
        star: 5
      }),
      managerUser.create({
        username: 'pizhun',
        uuid: 'pizhun',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        role: 25,
        name: '批准人',
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
