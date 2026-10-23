import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnsibleHostDetail from './';

jest.mock('./components/SecondaryTabRoutes', () => () => null);

describe('AnsibleHostDetail', () => {
  it('should show skeleton when loading', () => {
    const { container } = render(
      <AnsibleHostDetail
        status="PENDING"
        response={{ id: 5, name: 'test.example.com' }}
        router={{}}
        history={{}}
      />
    );
    expect(
      container.getElementsByClassName('react-loading-skeleton')
    ).toHaveLength(5);
  });

  it('should hide inventory without permission', () => {
    render(
      <AnsibleHostDetail
        status="RESOLVED"
        response={{ id: 5, permissions: { view_ansible_inventory: false } }}
        router={{}}
        history={{}}
      />
    );

    expect(screen.queryByText('Inventory')).not.toBeInTheDocument();
  });

  it('should show inventory with permission', () => {
    render(
      <AnsibleHostDetail
        status="RESOLVED"
        response={{ id: 5, permissions: { view_ansible_inventory: true } }}
        router={{}}
        history={{}}
      />
    );

    expect(screen.getByText('Inventory')).toBeInTheDocument();
  });
});
