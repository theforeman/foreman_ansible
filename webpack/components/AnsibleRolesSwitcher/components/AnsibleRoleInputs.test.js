import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import AnsibleRoleInputs from './AnsibleRoleInputs';

const fixtures = {
  'should render role to add': {
    role: { id: 2, name: 'test.role', hostAnsibleRoleId: 5, position: 2 },
    resourceName: 'host',
    idx: 14,
  },
  'should render role to remove': {
    role: { id: 2, name: 'test.role', hostAnsibleRoleId: 5, destroy: true },
    resourceName: 'host',
    idx: 14,
  },
};

describe('AnsibleRoleInputs', () =>
  testComponentSnapshotsWithFixtures(AnsibleRoleInputs, fixtures));
