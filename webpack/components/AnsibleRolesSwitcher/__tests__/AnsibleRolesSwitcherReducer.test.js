import { testReducerSnapshotWithFixtures } from '@theforeman/test';

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
  ANSIBLE_ROLES_ADD,
  ANSIBLE_ROLES_REMOVE,
  ANSIBLE_ROLES_ASSIGNED_PAGE_CHANGE,
} from '../AnsibleRolesSwitcherConstants';

const fixtures = {
  'should return initial state': {
    state: initialState,
    action: {
      type: undefined,
      payload: {},
    },
  },
  'should start loading on Ansible roles request': {
    state: initialState,
    action: {
      type: ANSIBLE_ROLES_REQUEST,
    },
  },
  'should stop loading on Ansible roles success': {
    state: initialState.set('loading', true),
    action: {
      type: ANSIBLE_ROLES_SUCCESS,
      payload: successPayload,
    },
  },
  'should stop loading on Ansible roles error': {
    state: initialState.set('loading', true),
    action: {
      type: ANSIBLE_ROLES_FAILURE,
      payload: { error: errorPayload },
    },
  },
  'should add Ansible role to assigned': {
    state: successState,
    action: {
      type: ANSIBLE_ROLES_ADD,
      payload: { role: ansibleRolesLong[8] },
    },
  },
  'should remove Ansible role from assigned': {
    state: successState,
    action: {
      type: ANSIBLE_ROLES_REMOVE,
      payload: { role: ansibleRolesLong[5] },
    },
  },
  'should change pagination for assigned roles': {
    state: successState,
    action: {
      type: ANSIBLE_ROLES_ASSIGNED_PAGE_CHANGE,
      payload: { pagination: { page: 20, perPage: 5 } },
    },
  },
};

describe('AnsibleRolesSwitcherReducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
