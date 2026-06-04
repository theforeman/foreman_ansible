import Immutable from 'seamless-immutable';

import {
  ANSIBLE_ROLES_REQUEST,
  ANSIBLE_ROLES_SUCCESS,
  ANSIBLE_ROLES_FAILURE,
  ANSIBLE_ROLES_DUAL_LIST_CHANGE,
} from './AnsibleRolesSwitcherConstants';

export const initialState = Immutable({
  loading: false,
  assignedRoles: [],
  toDestroyRoles: [],
  inheritedRoleIds: [],
  results: [],
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
        results: payload.results,
        assignedRoles: payload.initialAssignedRoles,
        inheritedRoleIds: payload.inheritedRoleIds,
        error: { errorMsg: '', status: '', statusText: '' },
      });
    case ANSIBLE_ROLES_FAILURE:
      return state.merge({ error: payload.error, loading: false });
    case ANSIBLE_ROLES_DUAL_LIST_CHANGE: {
      const { chosenNames } = payload;
      const inherited = state.assignedRoles.filter(role =>
        state.inheritedRoleIds.includes(role.id)
      );
      const currentOwn = state.assignedRoles.filter(
        role => !state.inheritedRoleIds.includes(role.id)
      );
      const roleByName = name =>
        currentOwn.find(role => role.name === name) ||
        state.results.find(role => role.name === name) ||
        state.toDestroyRoles.find(role => role.name === name);

      const removed = currentOwn.filter(
        role => !chosenNames.includes(role.name)
      );
      const newOwn = chosenNames
        .map(name => roleByName(name))
        .filter(role => role && !state.inheritedRoleIds.includes(role.id));

      return state.merge({
        assignedRoles: inherited.concat(newOwn),
        toDestroyRoles: state.toDestroyRoles
          .filter(item => !newOwn.some(role => role.id === item.id))
          .concat(removed.map(role => ({ ...role, destroy: true }))),
      });
    }
    default:
      return state;
  }
};

export default ansibleRoles;
