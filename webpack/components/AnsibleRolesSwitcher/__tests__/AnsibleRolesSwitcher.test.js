import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import AnsibleRolesSwitcher from '../AnsibleRolesSwitcher';

jest.mock('foremanReact/components/Pagination/PaginationWrapper');

const noop = () => {};

const fixtures = {
  'should render': {
    loading: false,
    pagination: { page: 1, perPage: 12 },
    itemCount: 20,
    addAnsibleRole: noop,
    removeAnsibleRole: noop,
    moveAnsibleRole: noop,
    getAnsibleRoles: noop,
    changeAssignedPage: noop,
    assignedPagination: { page: 1, perPage: 12 },
    assignedRolesCount: 2,
    assignedRoles: [],
    unassignedRoles: [],
    initialAssignedRoles: [],
    error: { statusText: '', errorMsg: '' },
    allAssignedRoles: [],
    toDestroyRoles: [],
    availableRolesUrl: 'http://test/roles',
    inheritedRoleIds: [],
    resourceName: 'Host',
    resourceId: 15,
    variablesUrl: '/hosts/14/variables',
    initFormObjectAttrs: noop,
    getAnsibleVariables: noop,
  },
};

describe('AnsibleRolesSwitcher', () =>
  testComponentSnapshotsWithFixtures(AnsibleRolesSwitcher, fixtures));
