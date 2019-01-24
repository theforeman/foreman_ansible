import Immutable from 'seamless-immutable';

import {
  ANSIBLE_ROLES_REQUEST,
  ANSIBLE_ROLES_SUCCESS,
  ANSIBLE_ROLES_FAILURE,
  ANSIBLE_ROLES_ADD,
  ANSIBLE_ROLES_REMOVE,
  ANSIBLE_ROLES_ASSIGNED_PAGE_CHANGE,
} from './AnsibleRolesSwitcherConstants';

const ansibleRolesSuccess = (state, payload) => {
  const {
    page,
    perPage,
    subtotal,
    results,
    initialAssignedRoles,
    inheritedRoleIds,
  } = payload;

  return state.merge({
    loading: false,
    itemCount: Number(subtotal),
    pagination: { page: Number(page), perPage: Number(perPage) },
    results,
    assignedRoles: initialAssignedRoles,
    inheritedRoleIds,
  });
};

const addItem = (list, item) => ([...(list || []), item]);

const removeItem = (list, item) => list.filter(listItem => item.id !== listItem.id);

const removeItemNewState = (state, role) => ({
  assignedRoles: removeItem(state.assignedRoles, role),
  results: addItem(state.results, role),
  itemCount: state.itemCount + 1,
});

const addItemNewState = (state, role) => ({
  assignedRoles: addItem(state.assignedRoles, role),
  itemCount: state.itemCount - 1,
});

const ansibleRoleAdd = (state, payload) =>
  state.merge(addItemNewState(state, payload.role));

const ansibleRoleRemove = (state, payload) =>
  state.merge(removeItemNewState(state, payload.role));

export const initialState = Immutable({
  loading: false,
  itemCount: 0,
  pagination: {
    page: 1,
    perPage: 20,
  },
  assignedRoles: [],
  inheritedRoleIds: [],
  results: [],
  assignedPagination: {
    page: 1,
    perPage: 20,
  },
  error: { errorMsg: '', status: '', statusText: '' },
});

const ansibleRoles = (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case ANSIBLE_ROLES_REQUEST:
      return state.set('loading', true);
    case ANSIBLE_ROLES_SUCCESS:
      return ansibleRolesSuccess(state, payload);
    case ANSIBLE_ROLES_FAILURE:
      return state.merge({ error: payload.error, loading: false });
    case ANSIBLE_ROLES_ADD:
      return ansibleRoleAdd(state, payload);
    case ANSIBLE_ROLES_REMOVE:
      return ansibleRoleRemove(state, payload);
    case ANSIBLE_ROLES_ASSIGNED_PAGE_CHANGE:
      return state.set('assignedPagination', payload.pagination);
    default:
      return state;
  }
};

export default ansibleRoles;
