// oss
import client from '../../util/oss';

// 算法
import uuid from 'uuid';

/**
 * 判断verifyName是否符合allowExtensionNameArr的拓展名
 * @param {Array} allowExtensionNameArr
 * @param {*} verifyName
 */
const verifyExtensionName = (allowExtensionNameArr, verifyName) =>
  allowExtensionNameArr.findIndex(name => name === verifyName) !== -1;

export default {
  /**
   * 上传文件
   */
  uploadFile: async (file, folderName) => {
    // 后缀名
    const extensionName = file.originalname.split('.')[1].toLowerCase();

    // 判断后缀名是否非法
    if (!verifyExtensionName(['jpg', 'jpeg', 'png'], extensionName)) {
      return -1;
    }

    // 判断大小是否符合
    if (file.size > 1024 * 1024 * 10) {
      // 10MB
      return -2;
    }

    // 上传到oss
    const fileUuid = uuid.v1(),
      fileUrl = `temp/${folderName}/${fileUuid}.${extensionName}`;

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
    if (!verifyExtensionName(['doc', 'docx', 'pdf'], extensionName)) {
      return -1;
    }

    // 判断大小是否符合
    if (file.size > 1024 * 1024 * 10) {
      // 10MB
      return -2;
    }

    // 上传到oss
    const fileUuid = uuid.v1(),
      fileUrl = `temp/${folderName}/${fileUuid}.${extensionName}`;

    // 上传文件
    await client.put(fileUrl, file.buffer);

    return fileUrl;
  },

  /**
   * 上传pdf文件
   */
  uploadPdfFile: async (file, folderName) => {
    // 后缀名
    const extensionName = file.originalname.split('.')[1].toLowerCase();

    // 判断后缀名是否非法
    if (!verifyExtensionName(['pdf'], extensionName)) {
      return -1;
    }

    // 判断大小是否符合
    if (file.size > 1024 * 1024 * 10) {
      // 10MB
      return -2;
    }

    // 上传到oss
    const fileUuid = uuid.v1(),
      fileUrl = `temp/${folderName}/${fileUuid}.${extensionName}`;

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
    if (!verifyExtensionName(['zip', 'rar'], extensionName)) {
      return -1;
    }

    // 判断大小是否符合
    if (file.size > 1024 * 1024 * 1024 * 10) {
      // 10GB
      return -2;
    }

    // 上传到oss
    const fileUuid = uuid.v1(),
      fileUrl = `temp/${folderName}/${fileUuid}.${extensionName}`;

    // 上传文件
    await client.put(fileUrl, file.buffer);

    return fileUrl;
  },

  uploadDownloadBufFile: async (fileBuf, folderName) => {
    // 上传到oss
    const fileUuid = uuid.v1(),
      fileUrl = `temp/${folderName}/${fileUuid}.docx`;

    // 上传文件
    await client.put(fileUrl, fileBuf);

    return await client.signatureUrl(fileUrl);
  },

  /**
   * 获取文件url
   */
  getFileUrl: async fileName => {
    return await client.signatureUrl(fileName);
  }
};
