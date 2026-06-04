import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import AnsibleRoleInputs from './AnsibleRoleInputs';

const queryInput = (container, name) =>
  container.querySelector(`input[name="${name}"]`);

describe('AnsibleRoleInputs', () => {
  it('renders fields for a role to add', () => {
    const { container } = render(
      <AnsibleRoleInputs
        role={{ id: 2, name: 'test.role', hostAnsibleRoleId: 5, position: 2 }}
        resourceName="host"
        idx={14}
      />
    );

    expect(
      queryInput(container, 'host[host_ansible_roles_attributes][14][id]')
    ).toHaveAttribute('value', '5');
    expect(
      queryInput(
        container,
        'host[host_ansible_roles_attributes][14][ansible_role_id]'
      )
    ).toHaveAttribute('value', '2');
    expect(
      queryInput(container, 'host[host_ansible_roles_attributes][14][position]')
    ).toHaveAttribute('value', '15');
    expect(
      queryInput(container, 'host[host_ansible_roles_attributes][14][_destroy]')
    ).toHaveAttribute('value', 'false');
  });

  it('renders fields for a role to remove', () => {
    const { container } = render(
      <AnsibleRoleInputs
        role={{
          id: 2,
          name: 'test.role',
          hostAnsibleRoleId: 5,
          destroy: true,
        }}
        resourceName="host"
        idx={14}
      />
    );

    expect(
      queryInput(container, 'host[host_ansible_roles_attributes][14][_destroy]')
    ).toHaveAttribute('value', 'true');
  });
});
