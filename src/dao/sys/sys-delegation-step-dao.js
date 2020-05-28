import sysDelegationStep from '../../db/models/sys-delegation-step';

export default {
  /**
   *  无参数查询sys_Delegation_step表
   */
  querySysDelegationStep: () =>
    sysDelegationStep.findAll({
      attributes: ['name', 'step']
    })
};