import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import AnsibleVariablesTableRows from '../AnsibleVariablesTableRows';

import { roles } from '../../AnsibleHostParams.fixtures';

const fixtures = {
  'should render': {
    assignedRoles: roles,
    resourceErrors: [],
    formObject: { resourceName: 'Host', resourceId: 4 },
  },
};

describe('AnsibleVariablesTableRows', () =>
  testComponentSnapshotsWithFixtures(AnsibleVariablesTableRows, fixtures));
