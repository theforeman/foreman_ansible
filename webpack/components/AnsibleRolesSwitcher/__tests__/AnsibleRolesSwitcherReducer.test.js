import reducer, { initialState } from '../AnsibleRolesSwitcherReducer';
import { ansibleRolesLong } from '../__fixtures__/ansibleRolesData.fixtures';
import {
  successPayload,
  successState,
  errorPayload,
} from '../__fixtures__/ansibleRolesSwitcherReducer.fixtures';
import {
  ANSIBLE_ROLES_REQUEST,
  ANSIBLE_ROLES_SUCCESS,
  ANSIBLE_ROLES_FAILURE,
  ANSIBLE_ROLES_DUAL_LIST_CHANGE,
} from '../AnsibleRolesSwitcherConstants';

describe('AnsibleRolesSwitcherReducer', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('sets loading on request', () => {
    expect(reducer(initialState, { type: ANSIBLE_ROLES_REQUEST })).toEqual(
      initialState.set('loading', true)
    );
  });

  it('stores roles and clears loading on success', () => {
    const state = reducer(initialState.set('loading', true), {
      type: ANSIBLE_ROLES_SUCCESS,
      payload: successPayload,
    });

    expect(state.loading).toBe(false);
    expect(state.results).toEqual(successPayload.results);
    expect(state.assignedRoles).toEqual(successPayload.initialAssignedRoles);
    expect(state.inheritedRoleIds).toEqual(successPayload.inheritedRoleIds);
    expect(state.error).toEqual({
      errorMsg: '',
      status: '',
      statusText: '',
    });
  });

  it('stores the error and clears loading on failure', () => {
    const state = reducer(initialState.set('loading', true), {
      type: ANSIBLE_ROLES_FAILURE,
      payload: { error: errorPayload },
    });

    expect(state.loading).toBe(false);
    expect(state.error).toEqual(errorPayload);
  });

  it('syncs assigned roles from dual list change', () => {
    const state = reducer(
      successState.set('assignedRoles', [
        ansibleRolesLong[3],
        ansibleRolesLong[4],
        ansibleRolesLong[5],
      ]),
      {
        type: ANSIBLE_ROLES_DUAL_LIST_CHANGE,
        payload: {
          chosenNames: [ansibleRolesLong[5].name, ansibleRolesLong[8].name],
        },
      }
    );

    expect(state.assignedRoles.map(role => role.id)).toEqual([4, 6, 9]);
    expect(state.toDestroyRoles).toEqual([
      { ...ansibleRolesLong[4], destroy: true },
    ]);
    expect(state.inheritedRoleIds).toEqual([4]);
    expect(state.results).toEqual(ansibleRolesLong);
  });
});
