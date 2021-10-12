import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { withRedux, withMockedProvider, tick } from '../../../../../testHelper';
import {
  deleteMocks,
  mocks,
  hostId,
  hostAttrs,
} from './AnsibleVariableOverrides.fixtures';

import * as toasts from '../../../../../toastHelper';

import AnsibleVariableOverrides from '../';

const TestComponent = withRedux(withMockedProvider(AnsibleVariableOverrides));

describe('AnsibleVariableOverrides', () => {
  it('should open and close delete modal', async () => {
    render(
      <TestComponent mocks={mocks} hostId={hostId} hostAttrs={hostAttrs} />
    );
    await waitFor(tick);
    userEvent.click(screen.getAllByRole('button', { name: 'Actions' })[0]);
    userEvent.click(screen.getByText('Delete'));
    await waitFor(tick);
    expect(
      screen.getByText('Delete Ansible Variable Override')
    ).toBeInTheDocument();
    userEvent.click(screen.getByText('Cancel'));
    await waitFor(tick);
    expect(
      screen.queryByText('Delete Ansible Variable Override')
    ).not.toBeInTheDocument();
  });
  it('should delete override', async () => {
    const showToast = jest.fn();
    jest.spyOn(toasts, 'showToast').mockImplementation(showToast);
    render(
      <TestComponent
        mocks={mocks.concat(deleteMocks)}
        hostId={hostId}
        hostAttrs={hostAttrs}
      />
    );
    await waitFor(tick);
    expect(screen.queryByText('21')).toBeInTheDocument();
    userEvent.click(screen.getAllByRole('button', { name: 'Actions' })[0]);
    userEvent.click(screen.getByText('Delete'));
    await waitFor(tick);
    userEvent.click(screen.getByText('Confirm'));
    await waitFor(tick);
    expect(showToast).toHaveBeenCalledWith({
      type: 'success',
      message: 'Ansible variable override was successfully deleted.',
    });
    await waitFor(tick);
    expect(screen.queryByText('21')).not.toBeInTheDocument();
    expect(screen.queryByText('101')).toBeInTheDocument();
  });
});
