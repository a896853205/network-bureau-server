import managerUser from '../db/models/manager-user';

export default {
  selectManagerUserByUsername: async username => {
    return await managerUser.findOne({
      where: { username },
      attributes: [
        'uuid',
        'phone',
        'username',
        'password',
        'name',
        'role'
      ]
    });
  }
};
