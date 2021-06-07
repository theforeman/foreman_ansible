import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import { withRedux, withMockedProvider, tick } from '../../../../../testHelper';
import {
  mocks,
  updateMocks,
  createMocks,
  updateErrorMocks,
  updateValidationMocks,
  hostId,
  hostAttrs,
} from './AnsibleVariableOverrides.fixtures';

import * as toasts from '../../../../../toastHelper';

import AnsibleVariableOverrides from '../';

const TestComponent = withRedux(withMockedProvider(AnsibleVariableOverrides));

describe('AnsibleVariableOverrides', () => {
  it('edit existing override', async () => {
    const showToast = jest.fn();
    jest.spyOn(toasts, 'showToast').mockImplementation(showToast);

    render(
      <TestComponent
        mocks={mocks.concat(updateMocks)}
        hostId={hostId}
        hostAttrs={hostAttrs}
      />
    );

    await waitFor(tick);
    expect(screen.getByText('21')).toBeInTheDocument();
    userEvent.click(
      screen.getAllByRole('button', { name: 'Edit override button' })[0]
    );
    userEvent.type(
      screen.getByRole('textbox', { name: 'Edit override field' }),
      '77'
    );
    userEvent.click(
      screen.getAllByRole('button', {
        name: 'Submit editing override button',
      })[0]
    );
    await waitFor(tick);
    expect(showToast).toHaveBeenCalledWith({
      type: 'success',
      message: 'Ansible variable override successfully changed.',
    });
    expect(screen.queryByText('21')).not.toBeInTheDocument();
    expect(screen.getByText('2177')).toBeInTheDocument();
  });
  it('should show unexpected errors', async () => {
    const showToast = jest.fn();
    jest.spyOn(toasts, 'showToast').mockImplementation(showToast);

    render(
      <TestComponent
        mocks={mocks.concat(updateErrorMocks)}
        hostId={hostId}
        hostAttrs={hostAttrs}
        hostName={hostAttrs.name}
      />
    );
    await waitFor(tick);
    userEvent.click(
      screen.getAllByRole('button', { name: 'Edit override button' })[0]
    );
    userEvent.type(
      screen.getByRole('textbox', { name: 'Edit override field' }),
      '77'
    );
    userEvent.click(
      screen.getAllByRole('button', {
        name: 'Submit editing override button',
      })[0]
    );
    await waitFor(tick);
    expect(showToast).toHaveBeenCalledWith({
      type: 'error',
      message:
        'There was a following error when changing Ansible variable override: Not enough minerals',
    });
    expect(
      screen.getByRole('textbox', { name: 'Edit override field' })
    ).toHaveValue('2177');
    userEvent.click(
      screen.getAllByRole('button', {
        name: 'Cancel editing override button',
      })[0]
    );
    expect(screen.getByText('21')).toBeInTheDocument();
  });
  it('should show client validations', async () => {
    render(
      <TestComponent
        mocks={mocks}
        hostId={hostId}
        hostAttrs={hostAttrs}
        hostName={hostAttrs.name}
      />
    );
    await waitFor(tick);
    userEvent.click(
      screen.getAllByRole('button', { name: 'Edit override button' })[1]
    );
    const input = screen.getByRole('textbox', { name: 'Edit override field' });
    const submitBtn = screen.getAllByRole('button', {
      name: 'Submit editing override button',
    })[1];
    userEvent.clear(input);
    expect(screen.getByText('is required')).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
    userEvent.type(input, 'd');
    expect(
      screen.getByText('Invalid, expected one of: a,b,c')
    ).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
    userEvent.clear(input);
    userEvent.type(input, 'c');
    expect(submitBtn).not.toBeDisabled();
  });
  it('should show server validations', async () => {
    render(
      <TestComponent
        mocks={mocks.concat(updateValidationMocks)}
        hostId={hostId}
        hostAttrs={hostAttrs}
        hostName={hostAttrs.name}
      />
    );
    await waitFor(tick);
    userEvent.click(
      screen.getAllByRole('button', { name: 'Edit override button' })[0]
    );
    const input = screen.getByRole('textbox', { name: 'Edit override field' });
    userEvent.clear(input);
    userEvent.type(input, 'foo');
    userEvent.click(
      screen.getAllByRole('button', {
        name: 'Submit editing override button',
      })[0]
    );
    await waitFor(tick);
    expect(screen.getByText('is invalid integer')).toBeInTheDocument();
  });
  it('should create new override', async () => {
    const showToast = jest.fn();
    jest.spyOn(toasts, 'showToast').mockImplementation(showToast);

    render(
      <TestComponent
        mocks={mocks.concat(createMocks)}
        hostId={hostId}
        hostAttrs={hostAttrs}
      />
    );
    await waitFor(tick);
    userEvent.click(
      screen.getAllByRole('button', { name: 'Edit override button' })[1]
    );
    const input = screen.getByRole('textbox', { name: 'Edit override field' });
    userEvent.clear(input);
    userEvent.type(input, 'b');
    userEvent.click(
      screen.getAllByRole('button', {
        name: 'Submit editing override button',
      })[1]
    );
    await waitFor(tick);
    expect(showToast).toHaveBeenCalledWith({
      type: 'success',
      message: 'Ansible variable override successfully changed.',
    });
  });
});
