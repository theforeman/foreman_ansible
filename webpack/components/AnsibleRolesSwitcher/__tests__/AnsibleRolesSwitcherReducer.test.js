import reducer, { initialState } from '../AnsibleRolesSwitcherReducer';

import { ansibleRolesLong } from '../__fixtures__/ansibleRolesData.fixtures';

import {
  successPayload,
  successState,
  errorPayload,
} from '../__fixtures__/AnsibleRolesSwitcherReducer.fixtures';

import {
  ANSIBLE_ROLES_REQUEST,
  ANSIBLE_ROLES_SUCCESS,
  ANSIBLE_ROLES_FAILURE,
  ANSIBLE_ROLES_ADD,
  ANSIBLE_ROLES_REMOVE,
  ANSIBLE_ROLES_ASSIGNED_PAGE_CHANGE,
} from '../AnsibleRolesSwitcherConstants';

describe('AnsibleRolesSwitcherReducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should start loading on Ansible roles request', () => {
    expect(reducer(initialState, { type: ANSIBLE_ROLES_REQUEST }).loading).toBe(true);
  });

  it('should stop loading on Ansible roles success', () => {
    expect(reducer(
      initialState.set('loading', true),
      { type: ANSIBLE_ROLES_SUCCESS, payload: successPayload },
    )).toEqual(successState);
  });

  it('should stop loading on Ansible roles error', () => {
    const newState = reducer(
      initialState.set('loading', true),
      { type: ANSIBLE_ROLES_FAILURE, payload: { error: errorPayload } },
    );
    expect(newState.error.errorMsg).toBe(errorPayload.errorMsg);
    expect(newState.error.statusText).toBe(errorPayload.statusText);
  });

  it('should add Ansible role to assigned', () => {
    const newState = reducer(
      successState,
      { type: ANSIBLE_ROLES_ADD, payload: { role: ansibleRolesLong[8] } },
    );

    expect(newState.assignedRoles).toEqual([...successState.assignedRoles, ansibleRolesLong[8]]);
  });

  it('should remove Ansible role from assigned', () => {
    const newState = reducer(
      successState,
      { type: ANSIBLE_ROLES_REMOVE, payload: { role: ansibleRolesLong[5] } },
    );

    expect(newState.assignedRoles).not.toContain(ansibleRolesLong[5]);
  });

  it('should change pagination for assigned roles', () => {
    const newPagination = { page: 20, perPage: 5 };

    const newState = reducer(
      successState,
      { type: ANSIBLE_ROLES_ASSIGNED_PAGE_CHANGE, payload: { pagination: newPagination } },
    );

    expect(newState.assignedPagination).toEqual(newPagination);
  });
});
