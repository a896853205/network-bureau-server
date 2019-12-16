// 环境
export const ENVIRONMENT = {
  DEV: 0, // 开发环境
  TEST: 1, // 测试环境
  PRO: 2 // 生产环境
};

// 权限
export const AUTHORITY = {
  SUPER: {
    name: '超级管理员',
    code: 1
  },
  ACCOUNTANT: {
    name: '财务',
    code: 5
  },
  PROJECT_MANAGER: {
    name: '项目管理人员',
    code: 10
  },
  TECH_LEADER: {
    name: '技术负责人',
    code: 15
  },
  TECH: {
    name: '技术人员',
    code: 20
  },
  CERTIFIER: {
    name: '批准人',
    code: 25
  }
};
