import { RESPONSE_CODE } from '../constants/domain-constants';
import CustomError from '../util/custom-error';

// 判断是否是业务逻辑错误
const isCustomError = err => err instanceof CustomError;
export default async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error(err);
    const msg = isCustomError(err) ? err.message : '网络错误,请稍后再试';
    ctx.throw(RESPONSE_CODE.error, msg);
  }
};
