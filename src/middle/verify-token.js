import webToken from '../util/token';
import verifyUnlessPath from '../util/verify-unless-path';

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
  if (verifyUnlessPath(ctx.url, UNLESS_PATH_ARR)) {
    await next();
  } else {
    // 获取jwt
    const token = ctx.header.authorization;

    try {
      let data = webToken.resolveToken(token),
        user = null;

      switch (data.auth) {
        case 'manager':
          user = await managerUserService.getManagerByUuid(data.uuid);

          break;
        case 'enterprise':
          user = await enterpriseUserService.getEnterpriseByUuid(data.uuid);

          break;
      }

      if (user) {
        ctx.state.user = user;

        await next();
      } else {
        ctx.body = new Result({
          status: 3,
          msg: '请重新登录'
        });
      }
    } catch (error) {
      ctx.body = new Result({
        status: 3,
        msg: '请重新登录'
      });
    }
  }
};
