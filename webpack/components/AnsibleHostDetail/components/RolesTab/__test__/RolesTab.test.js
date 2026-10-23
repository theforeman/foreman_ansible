import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import APIHelper from 'foremanReact/redux/API/API';
import {
  tick,
  withMockedProvider,
  withReactRouter,
  withRedux,
} from '../../../../../testHelper';

import {
  mocks,
  hostId,
  allRolesMocks,
  emptyRolesMocks,
  unauthorizedMocks,
  authorizedMocks,
} from './RolesTab.fixtures';

import RolesTab from '../';

jest.mock('axios');
jest.mock('foremanReact/redux/API/API');
const TestComponent = withRedux(withReactRouter(withMockedProvider(RolesTab)));

describe('RolesTab', () => {
  beforeEach(() => {
    APIHelper.get.mockResolvedValue({ data: [] });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should load Ansible Roles as admin', async () => {
    render(<TestComponent hostId={hostId} mocks={mocks} canEditHost />);
    await waitFor(tick);
    expect(screen.getByText('aardvaark.cube')).toBeInTheDocument();
    expect(screen.getByText('aardvaark.sphere')).toBeInTheDocument();
    expect(screen.getByText('another.role')).toBeInTheDocument();
  });
  it('should show all Ansible roles modal', async () => {
    render(
      <TestComponent
        hostId={hostId}
        mocks={mocks.concat(allRolesMocks)}
        canEditHost
      />
    );
    await waitFor(tick);
    expect(screen.getByText('view all assigned roles')).toBeInTheDocument();
    expect(
      screen.queryByText('All assigned Ansible roles')
    ).not.toBeInTheDocument();
    userEvent.click(screen.getByText('view all assigned roles'));
    await waitFor(tick);
    expect(screen.getByText('All assigned Ansible roles')).toBeInTheDocument();
    expect(screen.getByText('Inherited from Hostgroup')).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(tick);
    expect(
      screen.queryByText('All assigned Ansible roles')
    ).not.toBeInTheDocument();
  });
  it('should load Ansible Roles as viewer', async () => {
    render(
      <TestComponent
        hostId={hostId}
        mocks={authorizedMocks}
        canEditHost={false}
      />
    );
    await waitFor(tick);
    expect(screen.getByText('aardvaark.cube')).toBeInTheDocument();
    expect(screen.queryByText('Edit Ansible Roles')).not.toBeInTheDocument();
  });
  it('should not load Ansible Roles for unauthorized user', async () => {
    render(
      <TestComponent hostId={hostId} mocks={unauthorizedMocks} canEditHost />
    );
    await waitFor(tick);
    expect(screen.queryByText('aardvaark.cube')).not.toBeInTheDocument();
    expect(screen.getByText('Permission denied')).toBeInTheDocument();
    expect(
      screen.getByText(
        'You are not authorized to view the page. Request the following permissions from administrator: view_ansible_roles.'
      )
    ).toBeInTheDocument();
  });

  it('reloads inherited roles after the host is updated', async () => {
    APIHelper.get
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: [{ id: 1, name: 'inherited.role' }] });

    const { rerender } = render(
      <TestComponent
        hostId={hostId}
        hostUpdatedAt="2026-08-19T10:00:00Z"
        mocks={emptyRolesMocks}
        canEditHost
      />
    );

    await waitFor(() => expect(APIHelper.get).toHaveBeenCalledTimes(1));
    expect(screen.queryByText('View inherited roles')).not.toBeInTheDocument();

    rerender(
      <TestComponent
        hostId={hostId}
        hostUpdatedAt="2026-08-19T10:01:00Z"
        mocks={emptyRolesMocks}
        canEditHost
      />
    );

    await waitFor(() => expect(APIHelper.get).toHaveBeenCalledTimes(2));
    expect(await screen.findByText('View inherited roles')).toBeInTheDocument();
  });
});
