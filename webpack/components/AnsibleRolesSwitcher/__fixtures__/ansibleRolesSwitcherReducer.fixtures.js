import Immutable from 'seamless-immutable';

import { ansibleRolesLong } from './ansibleRolesData.fixtures';

export const successPayload = {
  page: 1,
  perPage: 5,
  subtotal: 11,
  results: ansibleRolesLong,
  initialAssignedRoles: ansibleRolesLong.slice(3, 6),
  inheritedRoleIds: [4],
};

export const successState = Immutable({
  loading: false,
  itemCount: 11,
  pagination: {
    page: 1,
    perPage: 5,
  },
  assignedRoles: [{ ...ansibleRolesLong[3], inherited: true }, ...ansibleRolesLong.slice(4, 6)],
  results: ansibleRolesLong,
  assignedPagination: {
    page: 1,
    perPage: 20,
  },
  error: { errorMsg: '', status: '', statusText: '' },
});

export const errorPayload = {
  errorMsg: 'Failed to fetch Ansible Roles from server.',
  statusText: '500',
};
