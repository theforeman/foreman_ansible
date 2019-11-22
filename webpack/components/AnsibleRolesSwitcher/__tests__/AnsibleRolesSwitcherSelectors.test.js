import { testSelectorsSnapshotWithFixtures } from '@theforeman/test';

import {
  selectUnassignedRoles,
  selectVariablesLoading,
  selectAssignedVariables,
  selectFormObject,
} from '../AnsibleRolesSwitcherSelectors';
import {
  ansibleRolesShort,
  ansibleAssignedVariables,
} from '../__fixtures__/ansibleRolesData.fixtures';

const stateFactory = obj => ({
  foremanAnsible: {
    ansibleRolesSwitcher: obj,
  },
});

const state1 = {
  results: ansibleRolesShort,
  assignedRoles: [{ id: 2 }, { id: 4 }],
};

const state2 = {
  results: ansibleRolesShort,
  assignedRoles: [],
};

const state3 = {
  assignedVariables: ansibleAssignedVariables,
};

const fixtures = {
  'should return unassigned roles': () =>
    selectUnassignedRoles(stateFactory(state1)),
  'should return all roles when no roles assigned': () =>
    selectUnassignedRoles(stateFactory(state2)),
  'should return assigned variables': () =>
    selectAssignedVariables(stateFactory(state3)),
  'should select variables loading': () =>
    selectVariablesLoading(stateFactory({ loadingVariables: true })),
  'should select form object': () =>
    selectFormObject(
      stateFactory({
        formObject: { resourceName: 'Host', resourceId: 5, parentId: 4 },
      })
    ),
};

describe('AnsibleRolesSwitcherSelectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
