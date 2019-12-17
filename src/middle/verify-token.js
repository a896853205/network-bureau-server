import webToken from '../util/token';

// 返回前台的对象
import Result from '../util/response';

// 配置
import { UNLESS_PATH_ARR } from '../config/system-config';

// service
import enterpriseUserService from '../service/enterprise-user-service';
import managerUserService from '../service/manager-user-service';

/**
 * token验证中间件
 */
export default async (ctx, next) => {
  if (verifyUnlessPath(ctx.url)) {
    await next();
  } else {
    // 获取jwt
    const token = ctx.header.authorization;

    try {
      let data = webToken.resolveToken(token),
        user = null;
      
      if (data.auth === 'manager') {
        user = await managerUserService.getManagerByUuid(data.uuid);
        ctx.state.user = user;

        await next();
      } else if (data.auth === 'enterprise') {
        user = await enterpriseUserService.getEnterpriseByUuid(data.uuid);
        ctx.state.user = user;

        await next();
      } else {
        ctx.body = new Result({
          status: 3,
          msg: '请重新登录'
        });
      }
    } catch (error) {
      console.error(error);
      ctx.body = new Result({
        status: 3,
        msg: '请重新登录'
      });
    }
  }
};

/**
 * 判断路径是否被排除
 * @param {String} currentPath 当前url
 */
const verifyUnlessPath = currentPath => {
  for (let i = 0; i < UNLESS_PATH_ARR.length; i++) {
    if (currentPath.match(UNLESS_PATH_ARR[i])) {
      return true;
    }
  }

  return false;
};
