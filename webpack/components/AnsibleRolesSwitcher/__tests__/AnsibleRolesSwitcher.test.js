import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import AnsibleRolesSwitcher from '../AnsibleRolesSwitcher';
import { ansibleRolesShort } from '../__fixtures__/ansibleRolesData.fixtures';

const defaultProps = {
  availableRolesUrl: 'http://test/roles',
  getAnsibleRoles: jest.fn(),
  dualListChange: jest.fn(),
  loading: false,
  assignedRoles: [],
  unassignedRoles: [],
  toDestroyRoles: [],
  initialAssignedRoles: [],
  inheritedRoleIds: [],
  error: { statusText: '', errorMsg: '' },
};

describe('AnsibleRolesSwitcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches roles on mount', () => {
    render(
      <AnsibleRolesSwitcher
        {...defaultProps}
        resourceId={1}
        resourceName="Host"
      />
    );

    expect(defaultProps.getAnsibleRoles).toHaveBeenCalledWith(
      'http://test/roles',
      [],
      [],
      1,
      'Host',
      {
        perPage: 'all',
      }
    );
  });

  it('shows a spinner while loading', () => {
    const { container } = render(
      <AnsibleRolesSwitcher {...defaultProps} loading />
    );

    expect(container.querySelector('.pf-v5-c-spinner')).toBeInTheDocument();
    expect(
      screen.queryByText('Available Ansible roles')
    ).not.toBeInTheDocument();
  });

  it('shows an error message when the request fails', () => {
    render(
      <AnsibleRolesSwitcher
        {...defaultProps}
        error={{
          errorMsg: 'Failed to fetch Ansible Roles from server.',
          statusText: '500',
        }}
      />
    );

    expect(
      screen.getByText(/Failed to fetch Ansible Roles from server/)
    ).toBeInTheDocument();
    expect(screen.getByText(/500:/)).toBeInTheDocument();
  });

  it('renders inherited roles, dual list panes, and order info', () => {
    render(
      <AnsibleRolesSwitcher
        {...defaultProps}
        assignedRoles={[
          { id: 4, name: 'geerlingguy.java', inherited: true },
          { id: 5, name: 'naftulikay.golang' },
        ]}
        unassignedRoles={[ansibleRolesShort[0], ansibleRolesShort[2]]}
      />
    );

    expect(screen.getByText('Inherited Ansible Roles')).toBeInTheDocument();
    expect(screen.getByText('geerlingguy.java')).toBeInTheDocument();
    expect(screen.getByText('Available Ansible roles')).toBeInTheDocument();
    expect(screen.getByText('Assigned Ansible roles')).toBeInTheDocument();
    expect(screen.getByText('sthirugn.motd')).toBeInTheDocument();
    expect(screen.getByText('rvm.ruby')).toBeInTheDocument();
    expect(screen.getByText('naftulikay.golang')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Use drag and drop to change order of the assigned roles/
      )
    ).toBeInTheDocument();
  });

  it('renders hidden inputs for assigned and removed roles', () => {
    const { container } = render(
      <AnsibleRolesSwitcher
        {...defaultProps}
        resourceName="Host"
        assignedRoles={[{ id: 5, name: 'naftulikay.golang' }]}
        toDestroyRoles={[
          {
            id: 2,
            name: 'jtyr.ntp',
            hostAnsibleRoleId: 9,
            destroy: true,
          },
        ]}
      />
    );

    expect(
      container.querySelector(
        'input[name="host[host_ansible_roles_attributes][0][ansible_role_id]"]'
      )
    ).toHaveAttribute('value', '5');
    expect(
      container.querySelector(
        'input[name="host[host_ansible_roles_attributes][1][ansible_role_id]"]'
      )
    ).toHaveAttribute('value', '2');
    expect(
      container.querySelector(
        'input[name="host[host_ansible_roles_attributes][1][_destroy]"]'
      )
    ).toHaveAttribute('value', 'true');
  });
});
