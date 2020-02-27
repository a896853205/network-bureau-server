import enterpriseRegistrationBasic from '../../db/models/enterprise-registration-basic';

export default {
  /**
   * 新增基本信息
   */
  insertRegistrationBasic: ({ uuid, transaction = null }) =>
    enterpriseRegistrationBasic.create(
      {
        uuid,
        status: 0,
        statusText: '未填写'
      },
      { transaction }
    ),
  /**
   * 查询的登记测试的基本信息
   */
  selectRegistrationBasicByRegistrationUuid: ({
    registrationUuid,
    transaction
  }) =>
    enterpriseRegistrationBasic.findOne({
      attributes: [
        'version',
        'linkman',
        'client',
        'phone',
        'address',
        'enterpriseName',
        'devStartTime',
        'failText',
        'status',
        'statusText'
      ],
      raw: true,
      where: { uuid: registrationUuid },
      transaction
    }),

  /**
   * 保存登记测试的基本信息
   */
  updateRegistrationBasic: ({
    registrationUuid,
    version,
    linkman,
    client,
    phone,
    address,
    devStartTime,
    enterpriseName,
    status,
    statusText,
    failText,
    transaction
  }) =>
    enterpriseRegistrationBasic.update(
      {
        version,
        linkman,
        client,
        phone,
        address,
        devStartTime,
        enterpriseName,
        status,
        statusText,
        failText
      },
      {
        where: { uuid: registrationUuid },
        raw: true,
        transaction
      }
    ),

  /**
   * 设置基本信息的状态
   */
  updateBasicStatus: ({
    registrationUuid,
    status,
    failText,
    statusText,
    transaction
  }) =>
    enterpriseRegistrationBasic.update(
      { status, failText, statusText },
      {
        where: { uuid: registrationUuid },
        transaction
      }
    )
};
