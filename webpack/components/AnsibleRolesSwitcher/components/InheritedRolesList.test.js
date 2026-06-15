import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import InheritedRolesList from './InheritedRolesList';

describe('InheritedRolesList', () => {
  it('renders nothing when there are no inherited roles', () => {
    const { container } = render(
      <InheritedRolesList roles={[]} resourceName="host" />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders inherited role names for a host', () => {
    render(
      <InheritedRolesList
        roles={[{ id: 4, name: 'geerlingguy.java' }]}
        resourceName="host"
      />
    );

    expect(screen.getByText('Inherited Ansible Roles')).toBeInTheDocument();
    expect(screen.getByText('geerlingguy.java')).toBeInTheDocument();
  });

  it('renders inherited role names for a host group', () => {
    render(
      <InheritedRolesList
        roles={[{ id: 4, name: 'geerlingguy.java' }]}
        resourceName="hostgroup"
      />
    );

    expect(screen.getByText('geerlingguy.java')).toBeInTheDocument();
  });
});
