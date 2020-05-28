import enterpriseDelegationCopyright from '../../db/models/enterprise-delegation-copyright';

export default {
  /**
   * 新增软件著作权
   */
  insertDelegationCopyright: ({ uuid, transaction = null }) =>
    enterpriseDelegationCopyright.create(
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
  selectDelegationCopyrightByDelegationUuid: ({
    delegationUuid,
    transaction
  }) =>
    enterpriseDelegationCopyright.findOne({
      attributes: ['url', 'failText', 'status', 'statusText'],
      raw: true,
      where: { uuid: delegationUuid },
      transaction
    }),

  
  /**
   * 查询的登记测试的状态信息
   */
  selectDelegationCopyrightStatusByDelegationUuid: ({
    delegationUuid,
    transaction
  }) =>
    enterpriseDelegationCopyright.findOne({
      attributes: ['status',],
      raw: true,
      where: { uuid: delegationUuid },
      transaction
    }),

  /**
   * 查询的现场测试软件著作权url信息
   */
  selectDelegationCopyrightUrlByDelegationUuid: delegationUuid =>
    enterpriseDelegationCopyright.findOne({
      attributes: ['url'],
      raw: true,
      where: { uuid: delegationUuid }
    }),

  /**
   * 保存现场测试软件著作权信息
   */
  updateDelegationCopyright: ({
    delegationUuid,
    copyrightUrl,
    status,
    statusText,
    failText,
    transaction = null
  }) =>
    enterpriseDelegationCopyright.update(
      {
        url: copyrightUrl,
        status,
        statusText,
        failText
      },
      {
        where: { uuid: delegationUuid },
        raw: true,
        transaction
      }
    ),

  /**
   * 设置软件著作权证书的状态
   */
  updateDelegationCopyrightStatus: ({
    delegationUuid,
    status,
    failText,
    statusText,
    transaction
  }) =>
    enterpriseDelegationCopyright.update(
      { status, failText, statusText },
      {
        where: { uuid: delegationUuid },
        transaction
      }
    )
};
