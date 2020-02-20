import Router from 'koa-router';
import multer from '@koa/multer';
// response
import Res from '../../util/response';
import { RESPONSE_CODE } from '../../constants/domain-constants';

// service
import service from '../../service';

const upload = multer();

const router = new Router({
  prefix: '/file'
});

router.post('/uploadFile', upload.single('file'), async (ctx, next) => {
  try {
    const param = ctx.request.file,
      folderName = ctx.request.body.folderName;

    const data = await service.uploadFile(param, folderName);

    ctx.body = new Res({
      data,
      status: RESPONSE_CODE.success,
      msg: '文件上传成功'
    });
  } catch (error) {
    throw error;
  }
});

router.post('/uploadWordFile', upload.single('file'), async (ctx, next) => {
  try {
    const param = ctx.request.file,
      folderName = ctx.request.body.folderName;

    const data = await service.uploadWordFile(param, folderName);

    ctx.body = new Res({
      data,
      status: RESPONSE_CODE.success,
      msg: '文件上传成功'
    });
  } catch (error) {
    throw error;
  }
});

router.post('/uploadPdfFile', upload.single('file'), async (ctx, next) => {
  try {
    const param = ctx.request.file,
      folderName = ctx.request.body.folderName;

    const data = await service.uploadPdfFile(param, folderName);

    ctx.body = new Res({
      data,
      status: RESPONSE_CODE.success,
      msg: '文件上传成功'
    });
  } catch (error) {
    throw error;
  }
});

router.post('/uploadZipFile', upload.single('file'), async (ctx, next) => {
  try {
    const param = ctx.request.file,
      folderName = ctx.request.body.folderName;

    const data = await service.uploadZipFile(param, folderName);

    ctx.body = new Res({
      data,
      status: RESPONSE_CODE.success,
      msg: '文件上传成功'
    });
  } catch (error) {
    throw error;
  }
});

router.get('/getFileUrl', async (ctx, next) => {
  try {
    const { fileUrl } = ctx.state.param;

    const url = await service.getFileUrl(fileUrl);

    ctx.body = new Res({
      data: url,
      status: RESPONSE_CODE.success
    });
  } catch (error) {
    throw error;
  }
});

export default router;
