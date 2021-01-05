import api from 'foremanReact/API';
import {
  propsToSnakeCase,
  propsToCamelCase,
} from 'foremanReact/common/helpers';

import {
  ANSIBLE_ROLES_REQUEST,
  ANSIBLE_ROLES_SUCCESS,
  ANSIBLE_ROLES_FAILURE,
  ANSIBLE_ROLES_ADD,
  ANSIBLE_ROLES_REMOVE,
  ANSIBLE_ROLES_ASSIGNED_PAGE_CHANGE,
} from './AnsibleRolesSwitcherConstants';

export const getAnsibleRoles = (
  url,
  initialAssignedRoles,
  inheritedRoleIds,
  resourceId,
  resourceName,
  pagination,
  search
) => async dispatch => {
  dispatch({ type: ANSIBLE_ROLES_REQUEST });

  const params = {
    ...propsToSnakeCase(pagination || {}),
    ...(search || {}),
    ...propsToSnakeCase({ resourceId, resourceName }),
  };

  try {
    const res = await api.get(url, {}, params);
    return dispatch({
      type: ANSIBLE_ROLES_SUCCESS,
      payload: {
        initialAssignedRoles,
        inheritedRoleIds,
        ...propsToCamelCase(res.data),
      },
    });
  } catch (error) {
    return dispatch(errorHandler(ANSIBLE_ROLES_FAILURE, error));
  }
};

const errorHandler = (msg, err) => {
  const error = {
    errorMsg: 'Failed to fetch Ansible Roles from server.',
    statusText: err.response.statusText,
  };
  return { type: msg, payload: { error } };
};

export const addAnsibleRole = role => ({
  type: ANSIBLE_ROLES_ADD,
  payload: { role },
});

export const removeAnsibleRole = role => ({
  type: ANSIBLE_ROLES_REMOVE,
  payload: { role },
});

export const changeAssignedPage = pagination => ({
  type: ANSIBLE_ROLES_ASSIGNED_PAGE_CHANGE,
  payload: { pagination },
});
