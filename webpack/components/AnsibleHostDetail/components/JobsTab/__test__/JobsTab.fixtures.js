import jobInvocationsQuery from '.../../../../graphql/queries/jobInvocations.gql';
import { scheduledJobsSearch, previousJobsSearch } from '../JobsTabHelper';

export const hostId = 3;

const mockFactory = (nodes, search) => [
  {
    request: {
      query: jobInvocationsQuery,
      variables: {
        search,
      },
    },
    result: {
      data: {
        jobInvocations: {
          nodes,
        },
      },
    },
  },
];

export const emptyScheduledMocks = mockFactory([], scheduledJobsSearch(hostId));
export const emptyPreviousMocks = mockFactory([], previousJobsSearch(hostId));

export const scheduledJobsMocks = mockFactory(
  [
    {
      id: 'MDE6Sm9iSW52b2NhdGlvbi0yNTY=',
      description: 'Run Ansible roles',
      startAt: '2021-07-31T13:37:00+02:00',
      statusLabel: 'queued',
      recurringLogic: {
        cronLine: '37 13 31 * *',
      },
      task: {
        state: 'scheduled',
        result: 'pending',
      },
    },
    {
      id: 'MDE6Sm9iSW52b2NhdGlvbi0yNzE=',
      description: 'Run Ansible roles',
      startAt: '2021-06-31T13:37:00+02:00',
      statusLabel: 'queued',
      recurringLogic: {
        cronLine: '54 10 15 * *',
      },
      task: {
        state: 'scheduled',
        result: 'pending',
      },
    },
  ],
  scheduledJobsSearch(hostId)
);

export const previousJobsMocks = mockFactory(
  [
    {
      id: 'MDE6Sm9iSW52b2NhdGlvbi0yODM=',
      description: 'Run Ansible roles',
      startAt: '2021-07-31T13:37:00+02:00',
      statusLabel: 'succeeded',
      recurringLogic: {
        cronLine: '30 * * * *',
      },
      task: {
        state: 'stopped',
        result: 'success',
      },
    },
    {
      id: 'MDE6Sm9iSW52b2NhdGlvbi0yODI=',
      description: 'Run Ansible roles',
      startAt: '2021-07-03T14:42:00+02:00',
      statusLabel: 'cancelled',
      recurringLogic: {
        cronLine: '42 14 * * *',
      },
      task: {
        state: 'stopped',
        result: 'cancelled',
      },
    },
    {
      id: 'MDE6Sm9iSW52b2NhdGlvbi0yNDc=',
      description: 'Run Ansible roles',
      startAt: '2021-05-19T12:58:00+02:00',
      statusLabel: 'failed',
      recurringLogic: {
        cronLine: '58 * * * *',
      },
      task: {
        state: 'stopped',
        result: 'warning',
      },
    },
  ],
  previousJobsSearch(hostId)
);
