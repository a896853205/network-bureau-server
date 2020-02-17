import webToken from '../util/token';
import verifyUnlessPath from '../util/verify-unless-path';
import { RESPONSE_CODE } from '../constants/domain-constants';

// 返回前台的对象
import Result from '../util/response';

// 配置
import { UNLESS_PATH_ARR } from '../config/system-config';

// service
import service from '../service';

/**
 * token验证中间件
 */
export default async (ctx, next) => {
  if (verifyUnlessPath(ctx.url, UNLESS_PATH_ARR)) {
    await next();
  } else {
    // 获取jwt
    const token = ctx.header.authorization;
    let user = null;

    try {
      let data = webToken.resolveToken(token);

      switch (data.auth) {
        case 'manager':
          user = await service.getManagerByManagerUuid(data.uuid);

          break;
        case 'enterprise':
          user = await service.getEnterpriseByUuid(data.uuid);

          // 设置上权限号
          user.role = 100;
          break;
      }
    } catch (error) {
      ctx.throw(RESPONSE_CODE.unauthorized, '请重新登录');
    }

    if (user) {
      ctx.state.user = user;

      await next();
    } else {
      ctx.throw(RESPONSE_CODE.unauthorized, '请重新登录');
    }
  }
};
