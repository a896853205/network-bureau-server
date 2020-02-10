// 权限
export const AUTHORITY = {
  SUPER: {
    name: '超级管理员',
    code: 1,
    router: '/superManager'
  },
  ACCOUNTANT: {
    name: '财务',
    code: 5,
    router: '/accountantManager'
  },
  PROJECT_MANAGER: {
    name: '项目管理人员',
    code: 10,
    router: '/projectManager'
  },
  TECH_LEADER: {
    name: '技术负责人',
    code: 15,
    router: '/techLeaderManager'
  },
  TECH: {
    name: '技术人员',
    code: 20,
    router: '/techManager'
  },
  CERTIFIER: {
    name: '批准人',
    code: 25,
    router: '/certifierManager'
  }
};
