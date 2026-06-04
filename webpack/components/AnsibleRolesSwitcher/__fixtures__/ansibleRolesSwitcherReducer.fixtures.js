import Immutable from 'seamless-immutable';

import { ansibleRolesLong } from './ansibleRolesData.fixtures';

export const successPayload = {
  results: ansibleRolesLong,
  initialAssignedRoles: ansibleRolesLong.slice(3, 6),
  inheritedRoleIds: [4],
};

export const successState = Immutable({
  loading: false,
  assignedRoles: [
    { ...ansibleRolesLong[3], inherited: true },
    ...ansibleRolesLong.slice(4, 6),
  ],
  results: ansibleRolesLong,
  toDestroyRoles: [],
  inheritedRoleIds: [4],
  error: { errorMsg: '', status: '', statusText: '' },
});

export const errorPayload = {
  errorMsg: 'Failed to fetch Ansible Roles from server.',
  statusText: '500',
};
