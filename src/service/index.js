import enterpriseRegistrationService from './enterprise/enterprise-registration-service';
import enterpriseUserService from './enterprise/enterprise-user-service';
import managerUserService from './manager/manager-user-service';
import fileService from './user/file-service';
import fieldTestsService from './enterprise/registration/field-tests';

export default {
  ...enterpriseRegistrationService,
  ...enterpriseUserService,
  ...managerUserService,
  ...fileService,
  ...fieldTestsService
};
