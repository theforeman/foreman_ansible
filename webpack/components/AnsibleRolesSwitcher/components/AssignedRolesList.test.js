import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import AssignedRolesList from './AssignedRolesList';

const noop = () => {};

const fixtures = {
  'should render': {
    allAssignedRoles: [
      { id: 1, name: 'fake.role' },
      { id: 2, name: 'test.role' },
    ],
    assignedRoles: [
      { id: 1, name: 'fake.role' },
      { id: 2, name: 'test.role' },
    ],
    pagination: { page: 1, perPage: 25 },
    itemCount: 2,
    onPaginationChange: noop,
    onRemoveRole: noop,
    onMoveRole: noop,
    resourceName: 'host',
    toDestroyRoles: [],
    unassignedRoles: [],
  },
};

describe('AssignedRolesList', () =>
  testComponentSnapshotsWithFixtures(AssignedRolesList, fixtures));
