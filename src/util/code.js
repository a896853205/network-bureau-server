//加权因子
const WEIGHTED_FACTORS = [
  1,
  3,
  9,
  27,
  19,
  26,
  16,
  17,
  20,
  29,
  25,
  13,
  8,
  24,
  10,
  30,
  28
];
const PATRN = /^[0-9A-Z]+$/;
// 不用I、O、S、V、Z
const CHAR_ORDER = '0123456789ABCDEFGHJKLMNPQRTUWXY';

export default code => {
  // 18位校验及大写校验
  if (code.length !== 18 || PATRN.test(code) === false) {
    return false;
  } else {
    let anCodeValueIndex,
      // 统一社会信用代码每一个值的权重
      total = 0;

    for (let i = 0; i < code.length - 1; i++) {
      anCodeValueIndex = CHAR_ORDER.indexOf(code[i]);
      // 权重与加权因子相乘之和
      total = total + anCodeValueIndex * WEIGHTED_FACTORS[i];
    }

    let logicCheckCodeIndex = (31 - (total % 31)) % 31,
      logicCheckCode = CHAR_ORDER[logicCheckCodeIndex];

    if (logicCheckCode !== code[17]) {
      return false;
    } else {
      return true;
    }
  }
};
