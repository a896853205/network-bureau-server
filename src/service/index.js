import enterpriseRegistrationService from './enterprise/enterprise-registration-service';
import enterpriseUserService from './enterprise/enterprise-user-service';
import managerUserService from './manager/manager-user-service';
import fileService from './user/file-service';
import fieldTestsService from './enterprise/registration/field-tests';
import enterpriseDelegationService from './enterprise/enterprise-delegation-service';
import delegationFieldTestsService from './enterprise/delegation/field-tests';
import delegationElectronicContractService from './enterprise/delegation/electronic-contract';
import delegationPaymentService from './enterprise/delegation/payment';
import delegationSubmitFileService from './enterprise/delegation/submit-file';

export default {
  ...enterpriseRegistrationService,
  ...enterpriseUserService,
  ...managerUserService,
  ...fileService,
  ...fieldTestsService,
  ...enterpriseDelegationService,
  ...delegationFieldTestsService,
  ...delegationElectronicContractService,
  ...delegationPaymentService,
  ...delegationSubmitFileService,
};
