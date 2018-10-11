import api from 'foremanReact/API';
import {
  propsToSnakeCase,
  propsToCamelCase,
} from 'foremanReact/common/helpers';

import { rolesByIdSearch } from './AnsibleRolesSwitcherHelpers';

import {
  ANSIBLE_ROLES_REQUEST,
  ANSIBLE_ROLES_SUCCESS,
  ANSIBLE_ROLES_FAILURE,
  ANSIBLE_ROLES_ADD,
  ANSIBLE_ROLES_REMOVE,
  ANSIBLE_ROLES_FORM_OBJECT,
  ANSIBLE_ROLES_ASSIGNED_PAGE_CHANGE,
  ANSIBLE_VARIABLES_REQUEST,
  ANSIBLE_VARIABLES_SUCCESS,
  ANSIBLE_VARIABLES_FAILURE,
  ANSIBLE_VARIABLES_REMOVE,
} from './AnsibleRolesSwitcherConstants';

export const getAnsibleRoles = (
  url,
  initialAssignedRoles,
  inheritedRoleIds,
  resourceId,
  resourceName,
  pagination,
  search
) => dispatch => {
  dispatch({ type: ANSIBLE_ROLES_REQUEST });

  const params = {
    ...propsToSnakeCase(pagination || {}),
    ...(search || {}),
    ...propsToSnakeCase({ resourceId, resourceName }),
  };

  return api
    .get(url, {}, params)
    .then(({ data }) =>
      dispatch({
        type: ANSIBLE_ROLES_SUCCESS,
        payload: {
          initialAssignedRoles,
          inheritedRoleIds,
          ...propsToCamelCase(data),
        },
      })
    )
    .catch(error => dispatch(errorHandler(ANSIBLE_ROLES_FAILURE, error)));
};

export const getAnsibleVariables = (url, search, resourceName, resourceId, parentId) => dispatch => {
  dispatch({ type: ANSIBLE_VARIABLES_REQUEST });

  if (!search.search) {
    return dispatch({
      type: ANSIBLE_VARIABLES_SUCCESS,
      payload: { results: [] },
    });
  }

  const params = { ...(search || {}), ...propsToSnakeCase({ resourceName, resourceId, parentId }) };
  return api
    .get(url, {}, params)
    .then(({ data }) =>
      dispatch({
        type: ANSIBLE_VARIABLES_SUCCESS,
        payload: {
          ...propsToCamelCase(data),
        }
      })
    )
    .catch(error => dispatch(errorHandler(ANSIBLE_VARIABLES_FAILURE, error)));
};

const errorHandler = (msg, err) => {
  const error = {
    errorMsg: 'Failed to fetch Ansible Roles from server.',
    statusText: err.response.statusText,
  };
  return { type: msg, payload: { error } };
};

export const addAnsibleRole = (role, variablesUrl, resourceName, resourceId) => dispatch => {
  dispatch({
    type: ANSIBLE_ROLES_ADD,
    payload: { role },
  });

  const search = rolesByIdSearch([role.id]);

  getAnsibleVariables(variablesUrl, search, resourceName, resourceId)(dispatch);
};

export const removeAnsibleRole = role => dispatch => {
  dispatch({
    type: ANSIBLE_ROLES_REMOVE,
    payload: { role },
  });

  dispatch({
    type: ANSIBLE_VARIABLES_REMOVE,
    payload: { role },
  });
};

export const changeAssignedPage = pagination => ({
  type: ANSIBLE_ROLES_ASSIGNED_PAGE_CHANGE,
  payload: { pagination },
});

export const initFormObjectAttrs = formObject => ({
  type: ANSIBLE_ROLES_FORM_OBJECT,
  payload: { formObject },
});
