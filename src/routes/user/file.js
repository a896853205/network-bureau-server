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
  } catch (error) {
    ctx.throw(RESPONSE_CODE.error, '上传错误');
  }
});

router.post('/uploadWordFile', upload.single('file'), async (ctx, next) => {
  try {
    const param = ctx.request.file,
      folderName = ctx.request.body.folderName;

    const data = await service.uploadWordFile(param, folderName);

    if (data === -1) {
      ctx.body = new Res({
        status: RESPONSE_CODE.error,
        msg: '文件格式必须为doc,docx,pdf'
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
  } catch (error) {
    ctx.throw(RESPONSE_CODE.error, '上传错误');
  }
});

router.post('/uploadPdfFile', upload.single('file'), async (ctx, next) => {
  try {
    const param = ctx.request.file,
      folderName = ctx.request.body.folderName;

    const data = await service.uploadPdfFile(param, folderName);

    if (data === -1) {
      ctx.body = new Res({
        status: RESPONSE_CODE.error,
        msg: '文件格式必须为pdf'
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
  } catch (error) {
    ctx.throw(RESPONSE_CODE.error, '上传错误');
  }
});

router.post('/uploadZipFile', upload.single('file'), async (ctx, next) => {
  try {
    const param = ctx.request.file,
      folderName = ctx.request.body.folderName;

    const data = await service.uploadZipFile(param, folderName);

    if (data === -1) {
      ctx.body = new Res({
        status: RESPONSE_CODE.error,
        msg: '文件格式必须为zip,rar'
      });
    } else if (data === -2) {
      ctx.body = new Res({
        status: RESPONSE_CODE.error,
        msg: '文件大小必须小于10GB'
      });
    } else {
      ctx.body = new Res({
        data,
        status: RESPONSE_CODE.success,
        msg: '文件上传成功'
      });
    }
  } catch (error) {
    ctx.throw(RESPONSE_CODE.error, '上传错误');
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
    ctx.throw(RESPONSE_CODE.error, '获取文件错误');
  }
});

export default router;
