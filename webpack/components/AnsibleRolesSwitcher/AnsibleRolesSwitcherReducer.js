import Immutable from 'seamless-immutable';

import {
  ANSIBLE_ROLES_REQUEST,
  ANSIBLE_ROLES_SUCCESS,
  ANSIBLE_ROLES_FAILURE,
  ANSIBLE_ROLES_ADD,
  ANSIBLE_ROLES_REMOVE,
  ANSIBLE_ROLES_MOVE,
  ANSIBLE_VARIABLES_REQUEST,
  ANSIBLE_VARIABLES_SUCCESS,
  ANSIBLE_VARIABLES_FAILURE,
  ANSIBLE_VARIABLES_REMOVE,
  ANSIBLE_ROLES_FORM_OBJECT,
} from './AnsibleRolesSwitcherConstants';

export const initialState = Immutable({
  loading: false,
  itemCount: 0,
  pagination: {
    page: 1,
    perPage: 10,
  },
  assignedRoles: [],
  toDestroyRoles: [],
  inheritedRoleIds: [],
  results: [],
  error: { errorMsg: '', status: '', statusText: '' },
  assignedVariables: [],
  loadingVariables: false,
  variablesError: {
    errorMsg: '',
    statusText: '',
    status: null,
    error: {},
  },
  formObject: {
    resourceName: '',
    resourceId: '',
    parentId: '',
  },
});

const ansibleRoles = (state = initialState, action) => {
  const { payload, response } = action;

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
        toDestroyRoles: state.toDestroyRoles.filter(
          item => item.id !== payload.role.id
        ),
        itemCount: state.itemCount - 1,
      });
    case ANSIBLE_ROLES_REMOVE:
      return state.merge({
        assignedRoles: Immutable.flatMap(state.assignedRoles, item =>
          item.id === payload.role.id ? [] : item
        ),
        results: state.results.find(item => payload.role.id === item.id)
          ? state.results
          : state.results.concat([payload.role]),
        toDestroyRoles: state.toDestroyRoles.concat([
          { ...payload.role, destroy: true },
        ]),
        itemCount: state.itemCount + 1,
      });
    case ANSIBLE_ROLES_MOVE:
      return state.set('assignedRoles', payload.roles);
    case ANSIBLE_ROLES_FORM_OBJECT:
      return state.set('formObject', payload.formObject);
    case ANSIBLE_VARIABLES_REQUEST:
      return state.set('loadingVariables', true);
    case ANSIBLE_VARIABLES_SUCCESS: {
      return state.merge({
        assignedVariables: response.results,
        loadingVariables: false,
      });
    }
    case ANSIBLE_VARIABLES_FAILURE:
      return state.merge({
        variablesError: response.error,
        loadingVariables: false,
      });
    case ANSIBLE_VARIABLES_REMOVE:
      return state.merge({
        assignedVariables: state.assignedVariables.filter(
          ansibleRole => ansibleRole.id !== payload.role.id
        ),
      });
    default:
      return state;
  }
};

export default ansibleRoles;
