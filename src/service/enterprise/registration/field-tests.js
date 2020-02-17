import { db } from '../../../db/db-connect';

// dao
import managerUserDao from '../../../dao/manager/manager-user-dao';
import enterpriseRegistrationDao from '../../../dao/enterprise/enterprise-registration-dao';
import enterpriseRegistrationStepDao from '../../../dao/enterprise/enterprise-registration-step-dao';
import enterpriseUserDao from '../../../dao/enterprise/enterprise-user-dao';
import enterpriseRegistrationCopyrightDao from '../../../dao/enterprise/enterprise-registration-copyright-dao';
import enterpriseRegistrationDocumentDao from '../../../dao/enterprise/enterprise-registration-document-dao';
import enterpriseRegistrationProductDescriptionDao from '../../../dao/enterprise/enterprise-registration-product-description-dao';
import enterpriseRegistrationProductDao from '../../../dao/enterprise/enterprise-registration-product-dao';

// oss
import client from '../../../util/oss';

export default {
  /**
   * 查询技术负责人
   */
  queryTechnicalManager: async page => {
    return await managerUserDao.queryTechnicalManagerUser(page);
  },

  /**
   * 安排技术负责人
   */
  arrangeTechLeaderManager: async ({
    registrationUuid,
    technicalManagerUuid
  }) => {
    try {
      await db.transaction(transaction => {
        return Promise.all([
          enterpriseRegistrationStepDao.updateRegistrationStep({
            registrationUuid,
            status: 2,
            statusText: '已选择技术负责人',
            step: 4,
            transaction
          }),
          enterpriseRegistrationStepDao.updateRegistrationStepManagerUuid({
            registrationUuid,
            step: 4,
            managerUuid: technicalManagerUuid,
            transaction
          }),
          enterpriseRegistrationDao.updateRegistrationTechLeaderUuid({
            registrationUuid,
            techLeaderManagerUuid: technicalManagerUuid,
            transaction
          })
        ]);
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  /**
   * 查询待分配技术负责人员的企业登记测试列表
   */
  queryRegistrationNeedAssigned: async ({ page, managerUuid }) => {
    const registrationList = await enterpriseRegistrationStepDao.queryRegistrationNeedAssignedByManagerUuid(
      managerUuid
    );

    const uuidList = registrationList.map(item => item.uuid);
    return await enterpriseRegistrationDao.queryRegistrationNeedAssigned({
      page,
      uuidList
    });
  },

  /**
   * 查询技术人员
   */
  queryTechManager: async page => {
    return await managerUserDao.queryTechManagerUser(page);
  },

  /**
   * 安排技术人员
   */
  arrangeTechManager: async ({ registrationUuid, techManagerUuid }) => {
    try {
      await db.transaction(transaction => {
        return Promise.all([
          enterpriseRegistrationStepDao.updateRegistrationStep({
            registrationUuid,
            status: 3,
            statusText: '已选择技术人员',
            step: 4,
            transaction
          }),
          enterpriseRegistrationDao.updateRegistrationTechManagerUuid({
            registrationUuid,
            techManagerUuid,
            transaction
          })
        ]);
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  /**
   * 查询登记测试企业信息(文件审核页面)
   */
  selectEnterpriseInfoByFileDownloadRegistrationUuid: async registrationUuid => {
    const uuid = await enterpriseRegistrationDao.selectEnterpriseInfoByRegistrationUuid(
      registrationUuid
    );

    return await enterpriseUserDao.selectEnterpriseByUuid(uuid.enterpriseUuid);
  },

  /**
   * 根据RegistrationUuid查询5个管理员信息
   */
  selectRegistrationManagerUuid: async registrationUuid => {
    return (registrationManagerUuidList = await enterpriseRegistrationDao.selectRegistrationByRegistrationUuid(
      registrationUuid
    ));
  },

  /**
   * 根据RegistrationUuid查询5个管理员信息
   */
  getRegistrationManagerInfo: async registrationUuid => {
    try {
      const registrationManagerUuidList = await enterpriseRegistrationDao.selectRegistrationByRegistrationUuid(
        registrationUuid
      );
      let managerList = await Promise.all([
        managerUserDao.selectManagerByManagerUuidAndRole({
          managerUuid: registrationManagerUuidList.projectManagerUuid,
          role: 10
        }),
        managerUserDao.selectManagerByManagerUuidAndRole({
          managerUuid: registrationManagerUuidList.accountantManagerUuid,
          role: 5
        }),
        managerUserDao.selectManagerByManagerUuidAndRole({
          managerUuid: registrationManagerUuidList.techLeaderManagerUuid,
          role: 15
        }),
        managerUserDao.selectManagerByManagerUuidAndRole({
          managerUuid: registrationManagerUuidList.techManagerUuid,
          role: 20
        }),
        managerUserDao.selectManagerByManagerUuidAndRole({
          managerUuid: registrationManagerUuidList.certifierManagerUuid,
          role: 25
        })
      ]);

      let haveHeadPortraitUrlManagerList = managerList.filter(
          manager => manager?.headPortraitUrl
        ),
        headPreviewUrlList = await Promise.all(
          haveHeadPortraitUrlManagerList.map(manager =>
            client.signatureUrl(manager.headPortraitUrl)
          )
        );

      haveHeadPortraitUrlManagerList = haveHeadPortraitUrlManagerList.map(
        (haveHeadPortraitUrlManager, index) => {
          haveHeadPortraitUrlManager.headPreviewUrl = headPreviewUrlList[index];
          return haveHeadPortraitUrlManager;
        }
      );

      managerList = managerList.map(manager =>
        manager?.headPortraitUrl
          ? haveHeadPortraitUrlManagerList.shift()
          : manager
      );

      return {
        projectManager: managerList[0],
        accountantManager: managerList[1],
        techLeaderManager: managerList[2],
        techManager: managerList[3],
        certifierManager: managerList[4]
      };
    } catch (error) {
      console.error('登记测试查询5个管理员错误');
      throw new Error(error);
    }
  }
};
