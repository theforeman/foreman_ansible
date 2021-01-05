import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import AvailableRolesList from './AvailableRolesList';

const noop = () => {};

const fixtures = {
  'should render': {
    unassignedRoles: [
      { id: 1, name: 'fake.role' },
      { id: 2, name: 'test.role' },
    ],
    pagination: { page: 1, perPage: 25 },
    itemCount: 2,
    onListingChange: noop,
    onAddRole: noop,
    loading: false,
  },
};

describe('AvailableRolesList', () =>
  testComponentSnapshotsWithFixtures(AvailableRolesList, fixtures));
