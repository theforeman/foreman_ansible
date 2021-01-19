import { testComponentSnapshotsWithFixtures } from '@theforeman/test';
import ImportRolesAndVariablesTable from '../AnsibleRolesAndVariables';

const rowsData = [
  {
    cells: [
      'bennojoy.ntp',
      'Update Role Variables',
      'Add: 1 Remove: 2 ',
      '',
      '',
    ],
    kind: 'old',
    id: 'bennojoy.ntp',
  },
  {
    cells: ['0ta2.git_role', 'Import Role ', 'Add: 5 ', '', ''],
    kind: 'new',
    id: '0ta2.git_role',
  },
];

const columnsData = [
  { title: 'Name' },
  { title: 'Operation' },
  { title: 'Variables' },
  { title: 'Hosts Count' },
  { title: 'Hostgroups count' },
];

const fixtures = {
  'should render': {
    rowsData,
    columnsData,
  },
};

describe('ImportRolesAndVariablesTable', () =>
  testComponentSnapshotsWithFixtures(ImportRolesAndVariablesTable, fixtures));
