import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import AssignedRolesList from './AssignedRolesList';

const noop = () => {};

const fixtures = {
  'should render': {
    assignedRoles: [{ id: 1, name: 'fake.role' }, { id: 2, name: 'test.role' }],
    pagination: { page: 1, perPage: 25 },
    itemCount: 2,
    onPaginationChange: noop,
    onRemoveRole: noop,
    resourceName: 'host',
  },
};

describe('AssignedRolesList', () => testComponentSnapshotsWithFixtures(AssignedRolesList, fixtures));
