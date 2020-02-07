import enterpriseRegistrationCopyright from '../../db/models/enterprise-registration-copyright';

export default {
  /**
   * 查询的现场测试软件著作权信息
   */
  selectRegistrationCopyrightByRegistrationUuid: async registrationUuid => {
    return await enterpriseRegistrationCopyright.findOne({
      attributes: ['url', 'failText', 'status', 'statusText'],
      raw: true,
      where: { uuid: registrationUuid }
    });
  },

  /**
   * 保存现场测试软件著作权信息
   */
  saveRegistrationCopyright: async ({
    registrationUuid,
    copyrightUrl,
    status,
    statusText,
    failText
  }) => {
    // 这里还得更新状态信息为2待审核
    return await enterpriseRegistrationCopyright.update(
      {
        url: copyrightUrl,
        status,
        statusText,
        failText
      },
      {
        where: { uuid: registrationUuid },
        raw: true
      }
    );
  },

  /**
   * 设置软件著作权证书的状态
   */
  setCopyrightStatus: async ({
    registrationUuid,
    status,
    failText,
    statusText
  }) => {
    return await enterpriseRegistrationCopyright.update(
      { status, failText, statusText },
      {
        where: { uuid: registrationUuid }
      }
    );
  }
};
