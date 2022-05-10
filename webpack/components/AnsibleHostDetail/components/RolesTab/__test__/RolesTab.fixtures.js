import {
  mockFactory,
  advancedMockFactory,
  admin,
  intruder,
  userFactory,
} from '../../../../../testHelper';
import ansibleRolesQuery from '../../../../../graphql/queries/hostAnsibleRoles.gql';
import availableAnsibleRolesQuery from '../../../../../graphql/queries/hostAvailableAnsibleRoles.gql';
import assignAnsibleRolesMutation from '../../../../../graphql/mutations/assignAnsibleRoles.gql';
import { decodeModelId } from '../../../../../globalIdHelper';

export const hostId = 3;
const hostGlobalId = 'MDE6SG9zdC0z';

const ansibleRolesMockFactory = mockFactory('host', ansibleRolesQuery);
const assignRolesMockFactory = mockFactory(
  'assignAnsibleRoles',
  assignAnsibleRolesMutation
);
const editModalDataFactory = advancedMockFactory(availableAnsibleRolesQuery);

const viewer = userFactory('roles_viewer', [
  {
    __typename: 'Permission',
    id: 'MDE6UGVybWlzc2lvbi0x',
    name: 'view_ansible_roles',
  },
]);

const role1 = {
  __typename: 'AnsibleRole',
  id: 'MDE6QW5zaWJsZVJvbGUtMw==',
  name: 'aardvaark.cube',
  path: '/ansible/ansible_roles/search="name = aardvaark.cube"',
  ansibleVariables: {
    totalCount: 1,
  },
  inherited: false,
};

const role2 = {
  __typename: 'AnsibleRole',
  id: 'MDE6QW5zaWJsZVJvbGUtNQ==',
  name: 'aardvaark.sphere',
  path: '/ansible/ansible_roles/search="name = aardvaark.sphere"',
  ansibleVariables: {
    totalCount: 2,
  },
  inherited: false,
};

const role3 = {
  __typename: 'AnsibleRole',
  id: 'MDE6QW5zaWJsZVJvbGUtMzA=',
  name: 'another.role',
  path: '/ansible/ansible_roles/search="name = another.role"',
  ansibleVariables: {
    totalCount: 3,
  },
  inherited: false,
};

const role4 = {
  __typename: 'AnsibleRole',
  id: 'MDE6QW5zaWJsZVJvbGUtMzk=',
  name: 'geerlingguy.ceylon',
  path: '/ansible/ansible_roles/search="name = geerlingguy.ceylon"',
  ansibleVariables: {
    totalCount: 4,
  },
  inherited: false,
};

const ansibleRolesMock = {
  totalCount: 3,
  nodes: [role1, role2, role3],
};

const ansibleRolesUpdatedMock = {
  totalCount: 3,
  nodes: [role1, role2, role4],
};

const availableRoles = {
  nodes: [
    role4,
    {
      __typename: 'AnsibleRole',
      id: 'MDE6QW5zaWJsZVJvbGUtMQ==',
      name: 'theforeman.foreman_scap_client',
      path:
        '/ansible/ansible_roles/search="name = theforeman.foreman_scap_client"',
      ansibleVariables: {
        totalCount: 23,
      },
    },
    {
      __typename: 'AnsibleRole',
      id: 'MDE6QW5zaWJsZVJvbGUtMg==',
      name: 'adriagalin.motd',
      path: '/ansible/ansible_roles/search="name = adriagalin.motd"',
      ansibleVariables: {
        totalCount: 23,
      },
    },
    {
      __typename: 'AnsibleRole',
      id: 'MDE6QW5zaWJsZVJvbGUtMjI=',
      name: 'geerlingguy.php',
      path: '/ansible/ansible_roles/search="name = geerlingguy.php"',
      ansibleVariables: {
        totalCount: 23,
      },
    },
    {
      __typename: 'AnsibleRole',
      id: 'MDE6QW5zaWJsZVJvbGUtNTc=',
      name: 'robertdebock.epel',
      path: '/ansible/ansible_roles/search="name = robertdebock.epel"',
      ansibleVariables: {
        totalCount: 23,
      },
    },
    {
      __typename: 'AnsibleRole',
      id: 'MDE6QW5zaWJsZVJvbGUtNTg=',
      name: 'geerlingguy.nfs',
      path: '/ansible/ansible_roles/search="name = geerlingguy.nfs"',
      ansibleVariables: {
        totalCount: 23,
      },
    },
  ],
};

export const mocks = ansibleRolesMockFactory(
  { id: hostGlobalId, first: 20, last: 20 },
  { __typename: 'Host', id: hostGlobalId, allAnsibleRoles: ansibleRolesMock },
  { currentUser: admin }
);

export const unauthorizedMocks = ansibleRolesMockFactory(
  { id: hostGlobalId, first: 20, last: 20 },
  { __typename: 'Host', id: hostGlobalId, allAnsibleRoles: ansibleRolesMock },
  { currentUser: intruder }
);

export const authorizedMocks = ansibleRolesMockFactory(
  { id: hostGlobalId, first: 20, last: 20 },
  { __typename: 'Host', id: hostGlobalId, allAnsibleRoles: ansibleRolesMock },
  { currentUser: viewer }
);

export const editModalOpenMocks = editModalDataFactory(
  {
    id: hostGlobalId,
  },
  {
    host: {
      __typename: 'Host',
      id: hostGlobalId,
      availableAnsibleRoles: availableRoles,
    },
  }
);

export const assignRolesSuccessMock = assignRolesMockFactory(
  {
    id: hostGlobalId,
    ansibleRoleIds: [role1, role2, role4].map(decodeModelId),
  },
  {
    host: {
      __typename: 'Host',
      id: hostGlobalId,
      ownAnsibleRoles: ansibleRolesUpdatedMock,
    },
    errors: [],
  }
);

export const assignRolesErrorMock = assignRolesMockFactory(
  {
    id: hostGlobalId,
    ansibleRoleIds: [role1, role2, role4].map(decodeModelId),
  },
  {
    host: {
      __typename: 'Host',
      id: hostGlobalId,
      ownAnsibleRoles: ansibleRolesMock,
    },
    errors: [{ path: ['attributes', 'base'], message: 'is invalid' }],
  }
);
