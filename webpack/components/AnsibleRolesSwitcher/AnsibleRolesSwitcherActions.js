import api from 'foremanReact/API';
import {
  propsToSnakeCase,
  propsToCamelCase,
} from 'foremanReact/common/helpers';
import { translate as __ } from 'foremanReact/common/I18n';

import {
  ANSIBLE_ROLES_REQUEST,
  ANSIBLE_ROLES_SUCCESS,
  ANSIBLE_ROLES_FAILURE,
  ANSIBLE_ROLES_DUAL_LIST_CHANGE,
} from './AnsibleRolesSwitcherConstants';

export const getAnsibleRoles = (
  url,
  initialAssignedRoles,
  inheritedRoleIds,
  resourceId,
  resourceName,
  pagination
) => async dispatch => {
  dispatch({ type: ANSIBLE_ROLES_REQUEST });

  const params = {
    ...propsToSnakeCase(pagination || {}),
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
    const err = {
      errorMsg: __('Failed to fetch Ansible Roles from server.'),
      statusText: error.response?.statusText,
    };
    return dispatch({
      type: ANSIBLE_ROLES_FAILURE,
      payload: { error: err },
    });
  }
};

export const dualListChange = chosenNames => ({
  type: ANSIBLE_ROLES_DUAL_LIST_CHANGE,
  payload: { chosenNames },
});
