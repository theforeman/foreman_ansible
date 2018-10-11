import { reduce, snakeCase, camelCase } from 'lodash';
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
) =>
  dispatch =>
    (pagination = {}, search = {}) => {
      dispatch({ type: ANSIBLE_ROLES_REQUEST });

      const params = {
        ...propsToSnakeCase(pagination),
        ...search,
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
        .catch(errorHandler(dispatch)(ANSIBLE_ROLES_FAILURE));
    };

const errorHandler = dispatch => msg => (err) => {
  const error = { errorMsg: 'Failed to fetch Ansible Roles from server.', statusText: err.response.statusText };
  dispatch({ type: msg, payload: { error } });
};

//  stolen from katello/webpack/services/index.js and modified
const propsToSnakeCase = ob =>
  propsToCase(snakeCase, 'propsToSnakeCase only takes objects', ob);

const propsToCamelCase = ob =>
  propsToCase(camelCase, 'propsToCamelCase only takes objects', ob);

const propsToCase = (casingFn, errorMsg, ob) => {
  if (typeof (ob) !== 'object') throw Error(errorMsg);
  return reduce(
    ob,
    (caseOb, val, key) => {
      // eslint-disable-next-line no-param-reassign
      caseOb[casingFn(key)] = val;
      return caseOb;
    },
    {},
  );
};

export const addAnsibleRole = role => dispatch =>
  dispatch({ type: ANSIBLE_ROLES_ADD, payload: { role } });

export const removeAnsibleRole = role => dispatch =>
  dispatch({ type: ANSIBLE_ROLES_REMOVE, payload: { role } });

export const changeAssignedPage = pagination => dispatch =>
  dispatch({ type: ANSIBLE_ROLES_ASSIGNED_PAGE_CHANGE, payload: { pagination } });
