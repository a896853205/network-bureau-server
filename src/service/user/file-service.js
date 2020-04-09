// oss
import client from '../../util/oss';

// 工具类
import CustomError from '../../util/custom-error';

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
    try {
      // 后缀名
      const extensionName = file.originalname.split('.')[1].toLowerCase();

      // 判断后缀名是否非法
      if (!verifyExtensionName(['jpg', 'jpeg', 'png'], extensionName)) {
        throw new CustomError('图片格式必须为jpg,jpeg,png');
      }

      // 判断大小是否符合
      if (file.size > 1024 * 1024 * 10) {
        // 10MB
        throw new CustomError('文件大小必须小于10MB');
      }

      // 上传到oss
      const fileUuid = uuid.v1(),
        fileUrl = `temp/${folderName}/${fileUuid}.${extensionName}`;

      // 上传文件
      await client.put(fileUrl, file.buffer);

      return fileUrl;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 上传word/pdf文件
   */
  uploadWordFile: async (file, folderName) => {
    try {
      // 后缀名
      const extensionName = file.originalname.split('.')[1].toLowerCase();

      // 判断后缀名是否非法
      if (!verifyExtensionName(['doc', 'docx', 'pdf'], extensionName)) {
        throw new CustomError('文件格式必须为doc,docx,pdf');
      }

      // 判断大小是否符合
      if (file.size > 1024 * 1024 * 10) {
        // 10MB
        throw new CustomError('文件大小必须小于10MB');
      }

      // 上传到oss
      const fileUuid = uuid.v1(),
        fileUrl = `temp/${folderName}/${fileUuid}.${extensionName}`;

      // 上传文件
      await client.put(fileUrl, file.buffer);

      return fileUrl;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 上传pdf文件
   */
  uploadPdfFile: async (file, folderName) => {
    try {
      // 后缀名
      const extensionName = file.originalname.split('.')[1].toLowerCase();

      console.log(extensionName);
      console.log(!verifyExtensionName(['pdf'], extensionName))
      // 判断后缀名是否非法
      if (!verifyExtensionName(['pdf'], extensionName)) {
        throw new CustomError('文件格式必须为pdf');
      }

      // 判断大小是否符合
      if (file.size > 1024 * 1024 * 10) {
        // 10MB
        throw new CustomError('文件大小必须小于10MB');
      }

      // 上传到oss
      const fileUuid = uuid.v1(),
        fileUrl = `temp/${folderName}/${fileUuid}.${extensionName}`;

      // 上传文件
      await client.put(fileUrl, file.buffer);

      return fileUrl;
    } catch (error) {
      throw error;
    }
  },

  /**
   * 上传zip/rar文件
   */
  uploadZipFile: async (file, folderName) => {
    try {
      // 后缀名
      const extensionName = file.originalname.split('.')[1].toLowerCase();

      // 判断后缀名是否非法
      if (!verifyExtensionName(['zip', 'rar'], extensionName)) {
        throw new CustomError('文件格式必须为zip, rar');
      }

      // 判断大小是否符合
      if (file.size > 1024 * 1024 * 1024 * 10) {
        // 10GB
        throw new CustomError('文件大小必须小于10GB');
      }

      // 上传到oss
      const fileUuid = uuid.v1(),
        fileUrl = `temp/${folderName}/${fileUuid}.${extensionName}`;

      // 上传文件
      await client.put(fileUrl, file.buffer);

      return fileUrl;
    } catch (error) {
      throw error;
    }
  },

  uploadDownloadBufFile: async (fileBuf, folderName) => {
    try {
      // 上传到oss
      const fileUuid = uuid.v1(),
        fileUrl = `temp/${folderName}/${fileUuid}.docx`;

      // 上传文件
      await client.put(fileUrl, fileBuf);

      return await client.signatureUrl(fileUrl);
    } catch (error) {
      throw error;
    }
  },

  /**
   * 获取文件url
   */
  getFileUrl: fileName => client.signatureUrl(fileName)
};
