import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import {
  tick,
  withMockedProvider,
  withReactRouter,
} from '../../../../../testHelper';
import { mocks, hostId } from './RolesTab.fixtures';

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
});
