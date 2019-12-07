export const TOKEN_DURATION = 60 * 60 * 24 * 7 * 1000;

// api不走token的数据
export const UNLESS_PATH_ARR = [
  '/enterpriseUser/getEnterpriseToken',
  '/enterpriseUser/createNewEnterprise'
];
