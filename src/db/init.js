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
const sysManagerRole = require('./models/sys-manager-role').default;

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

sysManagerRole
  .sync({
    force: true
  })
  .then(() => {
    console.log('管理员权限表初始化成功');

    sysManagerRole.bulkCreate([
      {
        name: '超级管理员',
        code: '1'
      },
      {
        name: '财务',
        code: '5'
      },
      {
        name: '项目管理人员',
        code: '10'
      },
      {
        name: '技术负责人',
        code: '15'
      },
      {
        name: '技术人员',
        code: '20'
      },
      {
        name: '批准人',
        code: '25'
      }
    ]);
    console.log('生成了权限内容');
  });
