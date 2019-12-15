import managerUser from '../db/models/manager-user';

import uuid from 'uuid';

export default {
  selectManagerUserByUsername: async username => {
    return await managerUser.findOne({
      where: { username },
      attributes: [
        'id',
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
