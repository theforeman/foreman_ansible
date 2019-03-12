import Immutable from 'seamless-immutable';

import {
  ANSIBLE_ROLES_REQUEST,
  ANSIBLE_ROLES_SUCCESS,
  ANSIBLE_ROLES_FAILURE,
  ANSIBLE_ROLES_ADD,
  ANSIBLE_ROLES_REMOVE,
  ANSIBLE_ROLES_ASSIGNED_PAGE_CHANGE,
} from './AnsibleRolesSwitcherConstants';

export const initialState = Immutable({
  loading: false,
  itemCount: 0,
  pagination: {
    page: 1,
    perPage: 10,
  },
  assignedRoles: [],
  inheritedRoleIds: [],
  results: [],
  assignedPagination: {
    page: 1,
    perPage: 10,
  },
  error: { errorMsg: '', status: '', statusText: '' },
});

const ansibleRoles = (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case ANSIBLE_ROLES_REQUEST:
      return state.set('loading', true);
    case ANSIBLE_ROLES_SUCCESS:
      return state.merge({
        loading: false,
        itemCount: Number(payload.subtotal),
        pagination: {
          page: Number(payload.page),
          perPage: Number(payload.perPage),
        },
        results: payload.results,
        assignedRoles: payload.initialAssignedRoles,
        inheritedRoleIds: payload.inheritedRoleIds,
      });
    case ANSIBLE_ROLES_FAILURE:
      return state.merge({ error: payload.error, loading: false });
    case ANSIBLE_ROLES_ADD:
      return state.merge({
        assignedRoles: state.assignedRoles.concat([payload.role]),
        itemCount: state.itemCount - 1,
      });
    case ANSIBLE_ROLES_REMOVE:
      return state.merge({
        assignedRoles: Immutable.flatMap(state.assignedRoles, item =>
          item.id === payload.role.id ? [] : item
        ),
        results: state.results.concat([payload.role]),
        itemCount: state.itemCount + 1,
      });
    case ANSIBLE_ROLES_ASSIGNED_PAGE_CHANGE:
      return state.set('assignedPagination', payload.pagination);
    default:
      return state;
  }
};

export default ansibleRoles;
