import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  tick,
  withMockedProvider,
  withReactRouter,
} from '../../../../../testHelper';

import {
  mocks,
  hostId,
  unauthorizedMocks,
  authorizedMocks,
} from './RolesTab.fixtures';

import RolesTab from '../';

const TestComponent = withReactRouter(withMockedProvider(RolesTab));

describe('RolesTab', () => {
  it('should load Ansible Roles as admin', async () => {
    render(<TestComponent hostId={hostId} mocks={mocks} canEditHost />);
    await waitFor(tick);
    expect(screen.getByText('aardvaark.cube')).toBeInTheDocument();
    expect(screen.getByText('aardvaark.sphere')).toBeInTheDocument();
    expect(screen.getByText('another.role')).toBeInTheDocument();
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
});
