import { snakeCase, camelCase } from 'lodash';
import api from 'foremanReact/API';

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
  search,
) => (dispatch) => {
  dispatch({ type: ANSIBLE_ROLES_REQUEST });

  const params = {
    ...propsToSnakeCase(pagination || {}),
    ...(search || {}),
    ...propsToSnakeCase({ resourceId, resourceName }),
  };

  return api.get(url, {}, params)
    .then(({ data }) => dispatch({
      type: ANSIBLE_ROLES_SUCCESS,
      payload: {
        initialAssignedRoles,
        inheritedRoleIds,
        ...propsToCamelCase(data),
      },
    }))
    .catch(error => dispatch(errorHandler(ANSIBLE_ROLES_FAILURE, error)));
};

const errorHandler = (msg, err) => {
  const error = { errorMsg: 'Failed to fetch Ansible Roles from server.', statusText: err.response.statusText };
  return ({ type: msg, payload: { error } });
};

//  stolen from katello/webpack/services/index.js and modified
const propsToSnakeCase = ob =>
  propsToCase(snakeCase, 'propsToSnakeCase only takes objects', ob);

const propsToCamelCase = ob =>
  propsToCase(camelCase, 'propsToCamelCase only takes objects', ob);

const propsToCase = (casingFn, errorMsg, ob) => {
  if (typeof (ob) !== 'object') throw Error(errorMsg);

  return Object.keys(ob).reduce((memo, key) => {
    // eslint-disable-next-line no-param-reassign
    memo[casingFn(key)] = ob[key];
    return memo;
  }, {});
};

export const addAnsibleRole = role =>
  ({ type: ANSIBLE_ROLES_ADD, payload: { role } });

export const removeAnsibleRole = role =>
  ({ type: ANSIBLE_ROLES_REMOVE, payload: { role } });

export const changeAssignedPage = pagination =>
  ({ type: ANSIBLE_ROLES_ASSIGNED_PAGE_CHANGE, payload: { pagination } });
