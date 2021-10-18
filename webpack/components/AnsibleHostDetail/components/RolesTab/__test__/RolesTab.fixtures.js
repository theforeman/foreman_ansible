import {
  mockFactory,
  advancedMockFactory,
  admin,
  intruder,
  userFactory,
} from '../../../../../testHelper';
import ansibleRolesQuery from '../../../../../graphql/queries/hostAnsibleRoles.gql';
import allAnsibleRolesQuery from '../../../../../graphql/queries/allAnsibleRoles.gql';
import availableAnsibleRolesQuery from '../../../../../graphql/queries/hostAvailableAnsibleRoles.gql';
import assignAnsibleRolesMutation from '../../../../../graphql/mutations/assignAnsibleRoles.gql';
import { decodeModelId } from '../../../../../globalIdHelper';

export const hostId = 3;
const hostGlobalId = 'MDE6SG9zdC0z';

const ansibleRolesMockFactory = mockFactory('host', ansibleRolesQuery);
const allAnsibleRolesMockFactory = mockFactory('host', allAnsibleRolesQuery);
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
};

const role2 = {
  __typename: 'AnsibleRole',
  id: 'MDE6QW5zaWJsZVJvbGUtNQ==',
  name: 'aardvaark.sphere',
};

const role3 = {
  __typename: 'AnsibleRole',
  id: 'MDE6QW5zaWJsZVJvbGUtMzA=',
  name: 'another.role',
};

const role4 = {
  __typename: 'AnsibleRole',
  id: 'MDE6QW5zaWJsZVJvbGUtMzk=',
  name: 'geerlingguy.ceylon',
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
    },
    {
      __typename: 'AnsibleRole',
      id: 'MDE6QW5zaWJsZVJvbGUtMg==',
      name: 'adriagalin.motd',
    },
    {
      __typename: 'AnsibleRole',
      id: 'MDE6QW5zaWJsZVJvbGUtMjI=',
      name: 'geerlingguy.php',
    },
    {
      __typename: 'AnsibleRole',
      id: 'MDE6QW5zaWJsZVJvbGUtNTc=',
      name: 'robertdebock.epel',
    },
    {
      __typename: 'AnsibleRole',
      id: 'MDE6QW5zaWJsZVJvbGUtNTg=',
      name: 'geerlingguy.nfs',
    },
  ],
};

export const allRolesMocks = allAnsibleRolesMockFactory(
  { id: hostGlobalId },
  {
    __typename: 'Host',
    id: hostGlobalId,
    allAnsibleRoles: {
      nodes: [
        {
          id: 'MDE6QW5zaWJsZVJvbGUtMg==',
          name: 'adriagalin.motd',
          inherited: true,
        },
        { ...role1, inherited: false },
        { ...role2, inherited: false },
        { ...role3, inherited: false },
      ],
    },
  }
);

const editModalData = {
  host: {
    __typename: 'Host',
    id: hostGlobalId,
    availableAnsibleRoles: availableRoles,
  },
};

export const mocks = ansibleRolesMockFactory(
  { id: hostGlobalId, first: 20, last: 20 },
  { __typename: 'Host', id: hostGlobalId, ownAnsibleRoles: ansibleRolesMock },
  { currentUser: admin }
);

export const unauthorizedMocks = ansibleRolesMockFactory(
  { id: hostGlobalId, first: 20, last: 20 },
  { __typename: 'Host', id: hostGlobalId, ownAnsibleRoles: ansibleRolesMock },
  { currentUser: intruder }
);

export const authorizedMocks = ansibleRolesMockFactory(
  { id: hostGlobalId, first: 20, last: 20 },
  { __typename: 'Host', id: hostGlobalId, ownAnsibleRoles: ansibleRolesMock },
  { currentUser: viewer }
);

export const editModalOpenMocks = editModalDataFactory(
  {
    id: hostGlobalId,
  },
  editModalData
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
