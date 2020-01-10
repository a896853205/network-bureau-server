// oss
import OSS from 'ali-oss';
import { OSS_OPTION } from '../constants/oss-constants';
import { ACCESS_KEY_ID, ACCESS_KEY_SECRET } from '../keys/keys';

// 算法
import uuid from 'uuid';

export default {
  /**
   * 上传文件
   */
  uploadFile: async (file, folderName) => {
    const client = new OSS({
      region: OSS_OPTION.region,
      bucket: OSS_OPTION.bucket,
      accessKeyId: ACCESS_KEY_ID,
      accessKeySecret: ACCESS_KEY_SECRET
    });

    // 后缀名
    const extensionName = file.originalname.split('.')[1].toLowerCase();

    // 判断后缀名是否非法
    if (
      extensionName !== 'jpg' &&
      extensionName !== 'jpeg' &&
      extensionName !== 'png'
    ) {
      return -1;
    }

    // 判断大小是否符合
    if (file.size > 1024 * 1024 * 10) {
      // 10MB
      return -2;
    }

    // 上传到oss
    const fileUuid = uuid.v1(),
      fileUrl = `${folderName}/${fileUuid}.${extensionName}`;

    // 上传文件
    await client.put(fileUrl, file.buffer);

    return fileUrl;
  },

  /**
   * 获取文件url
   */
  getFileUrl: async fileName => {
    const client = new OSS({
      region: OSS_OPTION.region,
      bucket: OSS_OPTION.bucket,
      accessKeyId: ACCESS_KEY_ID,
      accessKeySecret: ACCESS_KEY_SECRET
    });

    return await client.signatureUrl(fileName);
  }
};
