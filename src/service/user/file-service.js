// oss
import client from '../../util/oss';

// 算法
import uuid from 'uuid';

export default {
  /**
   * 上传文件
   */
  uploadFile: async (file, folderName) => {
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
   * 上传word/pdf文件
   */
  uploadWordFile: async (file, folderName) => {
    // 后缀名
    const extensionName = file.originalname.split('.')[1].toLowerCase();

    // 判断后缀名是否非法
    if (
      extensionName !== 'doc' &&
      extensionName !== 'docx' &&
      extensionName !== 'pdf'
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
   * 上传zip/rar文件
   */
  uploadZipFile: async (file, folderName) => {
    // 后缀名
    const extensionName = file.originalname.split('.')[1].toLowerCase();

    // 判断后缀名是否非法
    if (
      extensionName !== 'zip' &&
      extensionName !== 'rar' 
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
    return await client.signatureUrl(fileName);
  }
};
