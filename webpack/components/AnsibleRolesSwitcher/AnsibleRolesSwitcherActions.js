import api from 'foremanReact/API';
import {
  propsToSnakeCase,
  propsToCamelCase,
} from 'foremanReact/common/helpers';

import { reloadOverrides } from '../reloadOverrides';

import {
  ANSIBLE_ROLES_REQUEST,
  ANSIBLE_ROLES_SUCCESS,
  ANSIBLE_ROLES_FAILURE,
  ANSIBLE_ROLES_ADD,
  ANSIBLE_ROLES_REMOVE,
  ANSIBLE_ROLES_MOVE,
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

export const getAnsibleVariables = (
  url,
  search,
  resourceName,
  resourceId,
  assignedRoles
) => async dispatch => {
  if (!search.search) {
    return dispatch({
      type: ANSIBLE_VARIABLES_SUCCESS,
      response: { results: [] },
    });
  }

  const assignedRoleIds = assignedRoles.map(role => role.id);

  return fetchOverrides(
    url,
    dispatch,
    resourceId,
    resourceName,
    assignedRoleIds
  );
};

const errorHandler = (msg, err) => {
  const { response } = err;
  const { data } = response;
  const error = {
    errorMsg: 'Failed to fetch Ansible Roles from server.',
    statusText: response.statusText,
    status: response.status,
    error: data ? data.error : {},
  };
  return { type: msg, payload: { error } };
};

export const addAnsibleRole = (
  role,
  variablesUrl,
  resourceName,
  resourceId,
  assignedRoles
) => dispatch => {
  dispatch({
    type: ANSIBLE_ROLES_ADD,
    payload: { role },
  });

  const assignedRoleIds = assignedRoles
    .concat([role])
    .map(ansibleRole => ansibleRole.id);

  fetchOverrides(
    variablesUrl,
    dispatch,
    resourceId,
    resourceName,
    assignedRoleIds
  );
};

const fetchOverrides = (url, dispatch, resourceId, resourceName, roleIds) => {
  const onSuccess = results =>
    dispatch({
      type: ANSIBLE_VARIABLES_SUCCESS,
      response: { results },
    });

  const onError = response =>
    dispatch({
      type: ANSIBLE_VARIABLES_FAILURE,
      response,
    });

  dispatch({
    type: ANSIBLE_VARIABLES_REQUEST,
  });

  reloadOverrides(url, resourceId, resourceName, roleIds, onSuccess, onError);
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

export const moveAnsibleRole = roles => ({
  type: ANSIBLE_ROLES_MOVE,
  payload: { roles },
});

export const changeAssignedPage = pagination => ({
  type: ANSIBLE_ROLES_ASSIGNED_PAGE_CHANGE,
  payload: { pagination },
});

export const initFormObjectAttrs = formObject => ({
  type: ANSIBLE_ROLES_FORM_OBJECT,
  payload: { formObject },
});
