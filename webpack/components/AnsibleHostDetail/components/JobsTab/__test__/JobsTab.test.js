import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockedProvider } from '@apollo/react-testing';
import { MemoryRouter } from 'react-router-dom';

import { i18nProviderWrapperFactory } from 'foremanReact/common/i18nProviderWrapperFactory';

import RecurringJobsTable from '../';
import {
  emptyScheduledMocks,
  emptyPreviousMocks,
  scheduledJobsMocks,
  previousJobsMocks,
  hostId,
} from './JobsTab.fixtures';

const tick = () => new Promise(resolve => setTimeout(resolve, 0));

// eslint-disable-next-line react/prop-types
const TestComponent = ({ mocks, ...rest }) => (
  <MemoryRouter>
    <MockedProvider mocks={mocks} addTypename={false}>
      <RecurringJobsTable {...rest} />
    </MockedProvider>
  </MemoryRouter>
);

const now = new Date('2021-08-28 00:00:00 -1100');
const ComponentWithIntl = i18nProviderWrapperFactory(now, 'UTC')(TestComponent);

describe('JobsTab', () => {
  it('should load the page', async () => {
    render(
      <ComponentWithIntl
        response={{ id: hostId }}
        mocks={scheduledJobsMocks.concat(previousJobsMocks)}
      />
    );
    await waitFor(tick);
    await waitFor(tick);
    screen
      .getAllByText('Run Ansible roles')
      .map(element => expect(element).toBeInTheDocument());
    expect(screen.getByText('Scheduled recurring jobs')).toBeInTheDocument();
    expect(screen.getByText('Previously executed jobs')).toBeInTheDocument();
    expect(screen.getByText('37 13 31 * *')).toBeInTheDocument();
    expect(screen.getByText('54 10 15 * *')).toBeInTheDocument();
    expect(screen.getByText('30 * * * *')).toBeInTheDocument();
    expect(screen.getByText('42 14 * * *')).toBeInTheDocument();
    expect(screen.getByText('58 * * * *')).toBeInTheDocument();
  });
  it('should show empty state', async () => {
    render(
      <ComponentWithIntl
        response={{ id: hostId }}
        mocks={emptyScheduledMocks.concat(emptyPreviousMocks)}
      />
    );
    await waitFor(tick);
    await waitFor(tick);
    expect(
      screen.getByText('No config job for Ansible roles scheduled')
    ).toBeInTheDocument();
    expect(
      screen.getByText('No previous job executions found')
    ).toBeInTheDocument();
  });
});
