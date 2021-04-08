import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import RolesIndex from '../RolesIndex';

const rows = [
  {
    cells: [
      'dcos.cluster.dcos_agent',
      '1 /ansible/ansible_variables?search=ansible_role+%3D+dcos.cluster.dcos_agent',
      0,
      '0 /hosts?search=ansible_role+%3D+dcos.cluster.dcos_agent',
      'about 17 hours ago',
    ],

    id: 'dcos.cluster.dcos_agent',
    can_delete: true,
  },
  {
    cells: [
      'dcos.cluster.dcos_bootstrap',
      '8 /ansible/ansible_variables?search=ansible_role+%3D+dcos.cluster.dcos_bootstrap',
      0,
      '0 /hosts?search=ansible_role+%3D+dcos.cluster.dcos_bootstrap',
      'about 17 hours ago',
    ],
    id: 'dcos.cluster.dcos_bootstrap',
    can_delete: false,
  },
];

const fixtures = {
  'should render': {
    rows,
  },
};

describe('RolesIndexTable', () =>
  testComponentSnapshotsWithFixtures(RolesIndex, fixtures));
