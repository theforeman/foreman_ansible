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
  assignedRoles: [
    { ...ansibleRolesLong[3], inherited: true },
    ...ansibleRolesLong.slice(4, 6),
  ],
  results: ansibleRolesLong,
  toDestroyRoles: [],
  assignedPagination: {
    page: 1,
    perPage: 20,
  },
  error: { errorMsg: '', statusText: '', status: null, error: {} },
  formObject: { resourceName: 'Host', resourceId: 5, parentId: 15 },
  assignedVariables: [],
  loadingVariables: false,
  variablesError: {
    errorMsg: '',
    status: null,
    statusText: '',
    error: {},
  },
});

export const errorPayload = {
  errorMsg: 'Failed to fetch Ansible Roles from server.',
  statusText: '500',
};

export const permissionDeniedPayload = {
  errorMsg: 'Failed to fetch Ansible Roles from server.',
  statusText: 'Forbidden',
  status: 403,
  error: {
    message: 'Access Denied',
    description: 'You seem to be missing one of the following permissions: ',
    missingPermissions: ['view_ansible_variables'],
  },
};
