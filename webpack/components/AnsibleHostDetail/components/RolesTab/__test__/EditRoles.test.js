import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import RolesTab from '../';

import * as toasts from '../../../../../toastHelper';

import {
  tick,
  withMockedProvider,
  withRedux,
  withReactRouter,
} from '../../../../../testHelper';
import {
  mocks,
  hostId,
  editModalOpenMocks,
  assignRolesSuccessMock,
  assignRolesErrorMock,
} from './RolesTab.fixtures';

const TestComponent = withReactRouter(withRedux(withMockedProvider(RolesTab)));

describe('assigning Ansible roles', () => {
  it('should assign Ansible roles', async () => {
    const showToast = jest.fn();
    jest.spyOn(toasts, 'showToast').mockImplementation(showToast);

    render(
      <TestComponent
        hostId={hostId}
        mocks={mocks.concat(editModalOpenMocks).concat(assignRolesSuccessMock)}
        canEditHost
      />
    );
    await waitFor(tick);
    userEvent.click(screen.getByRole('button', { name: 'edit ansible roles' }));
    await waitFor(tick);
    await waitFor(tick);
    expect(screen.getByText('Available Ansible roles')).toBeInTheDocument();
    userEvent.click(screen.getAllByText('another.role')[1]);
    userEvent.click(screen.getByRole('button', { name: 'Remove selected' }));
    userEvent.click(screen.getByText('geerlingguy.ceylon'));
    userEvent.click(screen.getByRole('button', { name: 'Add selected' }));
    userEvent.click(
      screen.getByRole('button', { name: 'submit ansible roles' })
    );
    await waitFor(tick);
    expect(showToast).toHaveBeenCalledWith({
      type: 'success',
      message: 'Ansible Roles were successfully assigned.',
    });
  }, 8000);
  it('should show errors', async () => {
    const showToast = jest.fn();
    jest.spyOn(toasts, 'showToast').mockImplementation(showToast);

    render(
      <TestComponent
        hostId={hostId}
        mocks={mocks.concat(editModalOpenMocks).concat(assignRolesErrorMock)}
        canEditHost
      />
    );
    await waitFor(tick);
    userEvent.click(screen.getByRole('button', { name: 'edit ansible roles' }));
    await waitFor(tick);
    expect(screen.getByText('Available Ansible roles')).toBeInTheDocument();
    userEvent.click(screen.getAllByText('another.role')[1]);
    userEvent.click(screen.getByRole('button', { name: 'Remove selected' }));
    userEvent.click(screen.getByText('geerlingguy.ceylon'));
    userEvent.click(screen.getByRole('button', { name: 'Add selected' }));
    userEvent.click(
      screen.getByRole('button', { name: 'submit ansible roles' })
    );
    await waitFor(tick);
    expect(showToast).toHaveBeenCalledWith({
      type: 'error',
      message:
        'There was a following error when assigning Ansible Roles: is invalid',
    });
  }, 8000);
});
