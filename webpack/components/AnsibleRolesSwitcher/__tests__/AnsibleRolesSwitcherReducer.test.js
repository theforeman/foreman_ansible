import { testReducerSnapshotWithFixtures } from '@theforeman/test';

import reducer, { initialState } from '../AnsibleRolesSwitcherReducer';
import {
  ansibleRolesLong,
  ansibleAssignedVariables,
} from '../__fixtures__/ansibleRolesData.fixtures';

import {
  successPayload,
  successState,
  errorPayload,
  permissionDeniedPayload,
} from '../__fixtures__/ansibleRolesSwitcherReducer.fixtures';

import {
  ANSIBLE_ROLES_REQUEST,
  ANSIBLE_ROLES_SUCCESS,
  ANSIBLE_ROLES_FAILURE,
  ANSIBLE_ROLES_ADD,
  ANSIBLE_ROLES_REMOVE,
  ANSIBLE_ROLES_FORM_OBJECT,
  ANSIBLE_VARIABLES_REQUEST,
  ANSIBLE_VARIABLES_SUCCESS,
  ANSIBLE_VARIABLES_FAILURE,
  ANSIBLE_VARIABLES_REMOVE,
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
  'should set form object': {
    state: successState,
    action: {
      type: ANSIBLE_ROLES_FORM_OBJECT,
      payload: {
        formObject: { resourceName: 'Hostgroup', resourceId: 7, parentId: 6 },
      },
    },
  },
  'should start loading variables': {
    state: initialState,
    action: {
      type: ANSIBLE_VARIABLES_REQUEST,
      response: {},
    },
  },
  'should stop loading variables on success': {
    state: initialState.set('loadingVariables', true),
    action: {
      type: ANSIBLE_VARIABLES_SUCCESS,
      response: { results: ansibleAssignedVariables },
    },
  },
  'should stop loading on variables error': {
    state: initialState.set('loadingVariables', true),
    action: {
      type: ANSIBLE_VARIABLES_FAILURE,
      response: { error: permissionDeniedPayload },
    },
  },
  'should remove ansible variable': {
    state: initialState.set('assignedVariables', ansibleAssignedVariables),
    action: {
      type: ANSIBLE_VARIABLES_REMOVE,
      payload: { role: { id: 2 } },
    },
  },
};

describe('AnsibleRolesSwitcherReducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
