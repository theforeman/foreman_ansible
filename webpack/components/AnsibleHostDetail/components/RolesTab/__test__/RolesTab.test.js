import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {
  tick,
  withMockedProvider,
  withReactRouter,
} from '../../../../../testHelper';
import { mocks, allRolesMocks, hostId } from './RolesTab.fixtures';

import RolesTab from '../';

const TestComponent = withReactRouter(withMockedProvider(RolesTab));

describe('RolesTab', () => {
  it('should load Ansible Roles', async () => {
    render(<TestComponent hostId={hostId} mocks={mocks} />);
    await waitFor(tick);
    expect(screen.getByText('aardvaark.cube')).toBeInTheDocument();
    expect(screen.getByText('aardvaark.sphere')).toBeInTheDocument();
    expect(screen.getByText('another.role')).toBeInTheDocument();
  });
  it('should show all Ansible roles modal', async () => {
    render(
      <TestComponent hostId={hostId} mocks={mocks.concat(allRolesMocks)} />
    );
    await waitFor(tick);
    expect(screen.getByText('View all assigned roles')).toBeInTheDocument();
    expect(screen.queryByText('All Ansible Roles')).not.toBeInTheDocument();
    userEvent.click(screen.getByText('View all assigned roles'));
    await waitFor(tick);
    expect(screen.getByText('All Ansible Roles')).toBeInTheDocument();
    expect(screen.getByText('Inherited from Hostgroup')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(tick);
    expect(screen.queryByText('All Ansible Roles')).not.toBeInTheDocument();
  });
});
