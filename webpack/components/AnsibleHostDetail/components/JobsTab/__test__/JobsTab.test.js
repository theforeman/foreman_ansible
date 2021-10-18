import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { i18nProviderWrapperFactory } from 'foremanReact/common/i18nProviderWrapperFactory';
import JobsTab from '../';
import {
  emptyMocks,
  scheduledAndPreviousMocks,
  createMocks,
  hostId,
  futureDate,
} from './JobsTab.fixtures';
import * as toasts from '../../../../../toastHelper';

import { toCron } from '../NewRecurringJobHelper';

import {
  tick,
  withRouter,
  withMockedProvider,
  withRedux,
  historyMock,
} from '../../../../../testHelper';

const TestComponent = withRedux(withRouter(withMockedProvider(JobsTab)));

const now = new Date('2021-08-28 00:00:00 -1100');
const ComponentWithIntl = i18nProviderWrapperFactory(now, 'UTC')(TestComponent);

describe('JobsTab', () => {
  it('should load the page', async () => {
    render(
      <ComponentWithIntl
        resourceName="host"
        resourceId={hostId}
        mocks={scheduledAndPreviousMocks}
        history={historyMock}
      />
    );
    await waitFor(tick);
    await waitFor(tick);
    screen
      .getAllByText('Run Ansible roles')
      .map(element => expect(element).toBeInTheDocument());
    expect(screen.getByText('Scheduled recurring jobs')).toBeInTheDocument();
    expect(screen.getByText('Previously executed jobs')).toBeInTheDocument();
    expect(screen.getByText(toCron(futureDate, 'weekly'))).toBeInTheDocument();
    expect(screen.getByText('54 10 15 * *')).toBeInTheDocument();
  });
  it('should show empty state', async () => {
    render(
      <ComponentWithIntl
        resourceName="host"
        resourceId={hostId}
        mocks={emptyMocks}
        history={historyMock}
      />
    );
    await waitFor(tick);
    await waitFor(tick);
    expect(
      screen.getByText('No config job for Ansible roles scheduled')
    ).toBeInTheDocument();
  });
  it('should create new recurring job', async () => {
    const showToast = jest.fn();
    jest.spyOn(toasts, 'showToast').mockImplementation(showToast);

    render(
      <ComponentWithIntl
        resourceName="host"
        resourceId={hostId}
        mocks={createMocks}
        history={historyMock}
      />
    );
    await waitFor(tick);
    userEvent.click(
      screen.getByRole('button', { name: 'schedule recurring job' })
    );
    await waitFor(tick);
    userEvent.selectOptions(screen.getByLabelText(/repeat/), 'weekly');
    userEvent.type(
      screen.getByLabelText(/startTime/),
      futureDate
        .toISOString()
        .split('T')[1]
        .slice(0, 5)
    );
    userEvent.type(
      screen.getByLabelText(/startDate/),
      futureDate.toISOString().split('T')[0]
    );
    expect(
      screen.getByRole('button', { name: 'submit creating job' })
    ).not.toBeDisabled();
    userEvent.click(
      screen.getByRole('button', { name: 'submit creating job' })
    );
    await waitFor(tick);
    await waitFor(tick);
    await waitFor(tick);
    expect(showToast).toHaveBeenCalledWith({
      type: 'success',
      message: 'Ansible job was successfully created.',
    });
    await waitFor(tick);
    expect(screen.getByText(toCron(futureDate, 'weekly'))).toBeInTheDocument();
    expect(screen.getByText('in 3 days')).toBeInTheDocument();
    expect(
      screen.queryByText('No config job for Ansible roles scheduled')
    ).not.toBeInTheDocument();
  });
});
