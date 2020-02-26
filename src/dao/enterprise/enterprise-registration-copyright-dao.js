import enterpriseRegistrationCopyright from '../../db/models/enterprise-registration-copyright';

export default {
  /**
   * 新增软件著作权
   */
  insertRegistrationCopyright: ({ uuid, transaction = null }) =>
    enterpriseRegistrationCopyright.create(
      {
        uuid,
        status: 0,
        statusText: '未上传'
      },
      { transaction }
    ),
  /**
   * 查询的现场测试软件著作权信息
   */
  selectRegistrationCopyrightByRegistrationUuid: ({
    registrationUuid,
    transaction
  }) =>
    enterpriseRegistrationCopyright.findOne({
      attributes: ['url', 'failText', 'status', 'statusText'],
      raw: true,
      where: { uuid: registrationUuid },
      transaction
    }),

  /**
   * 查询的现场测试软件著作权url信息
   */
  selectRegistrationCopyrightUrlByRegistrationUuid: registrationUuid =>
    enterpriseRegistrationCopyright.findOne({
      attributes: ['url'],
      raw: true,
      where: { uuid: registrationUuid }
    }),

  /**
   * 保存现场测试软件著作权信息
   */
  updateRegistrationCopyright: ({
    registrationUuid,
    copyrightUrl,
    status,
    statusText,
    failText
  }) =>
    enterpriseRegistrationCopyright.update(
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
    ),

  /**
   * 设置软件著作权证书的状态
   */
  updateCopyrightStatus: ({
    registrationUuid,
    status,
    failText,
    statusText,
    transaction
  }) =>
    enterpriseRegistrationCopyright.update(
      { status, failText, statusText },
      {
        where: { uuid: registrationUuid },
        transaction
      }
    )
};
