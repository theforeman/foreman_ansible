import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import AnsibleHostParams from './AnsibleHostParams';

const props = {
  resourceErrors: [],
  highlightTabErrors: () => {},
  formObject: {
    resourceName: 'hostgroup',
    resourceId: null,
  },
};

const fixtures = {
  'should render when loading': {
    loading: true,
    assignedRoles: [],
    ...props,
  },
  'should render when loaded': {
    loading: false,
    assignedRoles: [],
    ...props,
  },
};

describe('AnsibleHostParams', () =>
  testComponentSnapshotsWithFixtures(AnsibleHostParams, fixtures));
