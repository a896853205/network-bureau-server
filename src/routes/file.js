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
  const param = ctx.request.file,
    folderName = ctx.request.body.folderName;

  const data = await fileService.uploadFile(param, folderName);

  if (data === -1) {
    ctx.body = new Res({
      status: RESPONSE_CODE.error,
      msg: '图片格式必须为jpg,jpeg,png'
    });
  } else if (data === -2) {
    ctx.body = new Res({
      status: RESPONSE_CODE.error,
      msg: '文件大小必须小于10MB'
    });
  } else {
    ctx.body = new Res({
      data,
      status: RESPONSE_CODE.success,
      msg: '文件上传成功'
    });
  }
});

router.get('/getFileUrl', async (ctx, next) => {
  const { fileUrl } = ctx.state.param;

  const url = await fileService.getFileUrl(fileUrl);

  if (url) {
    ctx.body = new Res({
      data: url,
      status: RESPONSE_CODE.success
    });
  } else {
    ctx.body = new Res({
      status: RESPONSE_CODE.error,
      msg: '获取文件错误'
    });
  }
});

export default router;
