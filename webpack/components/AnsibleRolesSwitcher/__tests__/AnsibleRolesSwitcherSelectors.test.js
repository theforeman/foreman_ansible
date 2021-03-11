import { testSelectorsSnapshotWithFixtures } from '@theforeman/test';

import { selectUnassignedRoles } from '../AnsibleRolesSwitcherSelectors';
import { ansibleRolesShort } from '../__fixtures__/ansibleRolesData.fixtures';

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

const fixtures = {
  'should return unassigned roles': () =>
    selectUnassignedRoles(stateFactory(state1)),
  'should return all roles when no roles assigned': () =>
    selectUnassignedRoles(stateFactory(state2)),
};

describe('AnsibleRolesSwitcherSelectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
