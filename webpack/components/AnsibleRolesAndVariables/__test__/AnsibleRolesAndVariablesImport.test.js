import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
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

describe('ImportRolesAndVariablesTable', () => {
  it('should render', () => {
    render(
      <ImportRolesAndVariablesTable
        rowsData={rowsData}
        columnsData={columnsData}
      />
    );
    expect(screen.getByText('bennojoy.ntp')).toBeInTheDocument();
    expect(screen.getByText('0ta2.git_role')).toBeInTheDocument();
  });
});
