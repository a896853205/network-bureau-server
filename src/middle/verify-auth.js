import { AUTHORITY } from '../constants/app-constants';
import Res from '../util/response';
import { RESPONSE_CODE } from '../constants/domain-constants';
import verifyUnlessPath from '../util/verify-unless-path';

// 配置
import { UNLESS_PATH_ARR } from '../config/system-config';


/**
 * 判断管理员权限是否匹配后面的路由
 */
export default auth => {
  return _verify[auth];
};

const _verify = {
  [AUTHORITY.SUPER.name]: (ctx, next) => {
    if (verifyUnlessPath(ctx.url, UNLESS_PATH_ARR)) {
      next();
    } else {
      if (ctx.state.user.role === AUTHORITY.SUPER.code) {
        next();
      } else {
        ctx.body = new Res({
          status: RESPONSE_CODE.unauthorized,
          msg: '您没有此权限'
        });
      }
    }
  },
  [AUTHORITY.ACCOUNTANT.name]: (ctx, next) => {
    if (verifyUnlessPath(ctx.url, UNLESS_PATH_ARR)) {
      next();
    } else {
      if (ctx.state.user.role === AUTHORITY.ACCOUNTANT.code) {
        next();
      } else {
        ctx.body = new Res({
          status: RESPONSE_CODE.unauthorized,
          msg: '您没有此权限'
        });
      }
    }
  },
  [AUTHORITY.PROJECT_MANAGER.name]: (ctx, next) => {
    if (verifyUnlessPath(ctx.url, UNLESS_PATH_ARR)) {
      next();
    } else {
      if (ctx.state.user.role === AUTHORITY.PROJECT_MANAGER.code) {
        next();
      } else {
        ctx.body = new Res({
          status: RESPONSE_CODE.unauthorized,
          msg: '您没有此权限'
        });
      }
    }
  },
  [AUTHORITY.TECH_LEADER.name]: (ctx, next) => {
    if (verifyUnlessPath(ctx.url, UNLESS_PATH_ARR)) {
      next();
    } else {
      if (ctx.state.user.role === AUTHORITY.TECH_LEADER.code) {
        next();
      } else {
        ctx.body = new Res({
          status: RESPONSE_CODE.unauthorized,
          msg: '您没有此权限'
        });
      }
    }
  },
  [AUTHORITY.TECH.name]: (ctx, next) => {
    if (verifyUnlessPath(ctx.url, UNLESS_PATH_ARR)) {
      next();
    } else {
      if (ctx.state.user.role === AUTHORITY.TECH.code) {
        next();
      } else {
        ctx.body = new Res({
          status: RESPONSE_CODE.unauthorized,
          msg: '您没有此权限'
        });
      }
    }
  },
  [AUTHORITY.CERTIFIER.name]: (ctx, next) => {
    if (verifyUnlessPath(ctx.url, UNLESS_PATH_ARR)) {
      next();
    } else {
      if (ctx.state.user.role === AUTHORITY.CERTIFIER.code) {
        next();
      } else {
        ctx.body = new Res({
          status: RESPONSE_CODE.unauthorized,
          msg: '您没有此权限'
        });
      }
    }
  }
};