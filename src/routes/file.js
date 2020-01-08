import Router from 'koa-router';
import multer from '@koa/multer';
// response
import Res from '../util/response';
import { RESPONSE_CODE } from '../constants/domain-constants';

// service
import fileService from '../service/file-service';

const upload = multer();

const router = new Router({
  prefix: '/file'
});

router.post('/uploadFile', upload.single('file'), async (ctx, next) => {
  const param = ctx.request.file;

  const res = await fileService.uploadFile(param);

  if (res === -1) {
    ctx.body = new Res({
      data: res,
      status: RESPONSE_CODE.error,
      msg: '图片格式必须为jpg,jpeg,png'
    });
  } else if (res === -2) {
    ctx.body = new Res({
      data: res,
      status: RESPONSE_CODE.error,
      msg: '文件大小必须小于10MB'
    });
  } else {
    ctx.body = new Res({
      data: res,
      status: RESPONSE_CODE.success,
      msg: '文件上传成功'
    });
  }
});

export default router;
