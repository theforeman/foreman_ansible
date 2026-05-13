import { testComponentSnapshotsWithFixtures } from '@theforeman/test';

import AnsibleRole from './AnsibleRole';

const noop = () => {};

const fixtures = {
  'should render a role to add': {
    role: { name: 'test.role', id: 5 },
    icon: 'plus-circle',
    onClick: noop,
    index: 0,
  },
  'should render a role to remove': {
    role: { name: 'test.role', id: 5 },
    icon: 'minus-circle',
    onClick: noop,
    index: 0,
  },
  'should render inherited role to remove': {
    role: { name: 'test.role', id: 5, inherited: true },
    icon: 'minus-circle',
    onClick: noop,
    index: 0,
  },
};

describe('AnsibleRole', () =>
  testComponentSnapshotsWithFixtures(AnsibleRole, fixtures));
