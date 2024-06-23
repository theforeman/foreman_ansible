import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/dom';
import { AnsibleRolesTable } from './AnsibleRolesTable';
import { withMockedProvider, withRedux } from '../../testHelper';

const TestComponent = withRedux(withMockedProvider(AnsibleRolesTable));

describe('AnsibleRolesTable', () => {
  const demoRoles = [
    {
      name: 'demo_role_0',
      hostgroupsCount: 0,
      hostsCount: 0,
      id: 1,
      updatedAt: '2024-01-28',
      importTime: '3 days ago',
      variablesCount: 1,
    },
    {
      name: 'demo_role_1',
      hostgroupsCount: 0,
      hostsCount: 0,
      id: 2,
      updatedAt: '2024-01-29',
      importTime: '2 days ago',
      variablesCount: 2,
    },
    {
      name: 'demo_role_2',
      hostgroupsCount: 0,
      hostsCount: 0,
      id: 3,
      updatedAt: '2024-01-30',
      importTime: '1 day ago',
      variablesCount: 3,
    },
  ];

  it('should render the table', () => {
    const { container } = render(<TestComponent ansibleRoles={demoRoles} />);
    expect(container.getElementsByTagName('tr')).toHaveLength(
      demoRoles.length + 1
    );
  });
  it('should sort correctly', () => {
    Object.defineProperty(window, 'location', {
      value: new URL('https://test.url/ansible/ansible_roles'),
      writable: true,
    });
    render(<TestComponent ansibleRoles={demoRoles} />);

    const importedButton = screen.getByText('Imported at');
    importedButton.click(); // asc

    expect(global.window.location.search).toContain('order=updated_at+asc');
    importedButton.click(); // asc
  });
});
