import { scheduledJobsSearch, previousJobsSearch } from '../JobsTabHelper';

import recurringJobsQuery from '.../../../../graphql/queries/recurringJobs.gql';
import createJobMutation from '../../../../../graphql/mutations/createJobInvocation.gql';
import { mockFactory } from '../../../../../testHelper';

import { toVars, toCron } from '../NewRecurringJobHelper';

export const hostId = 3;

const today = new Date();
const futureDate = new Date(today.setDate(today.getDate() + 3));
futureDate.setMilliseconds(0);
futureDate.setSeconds(0);
export { futureDate };

export const firstJob = {
  __typename: 'JobInvocation',
  id: 'MDE6Sm9iSW52b2NhdGlvbi0yNTY=',
  description: 'Run Ansible roles',
  startAt: futureDate.toISOString(),
  statusLabel: 'queued',
  recurringLogic: {
    __typename: 'ForemanTasks::RecurringLogic',
    id: 'MDE6Rm9yZW1hblRhc2tzOjpSZWN1cnJpbmdMb2dpYy0x',
    cronLine: toCron(futureDate, 'weekly'),
  },
  task: {
    __typename: 'ForemanTasks::Task',
    id:
      'MDE6Rm9yZW1hblRhc2tzOjpUYXNrLTg2OGE5NjRlLWZmMzctNGUxZS1iMzVkLTA5NzdkY2JkOTZhMw==',
    state: 'scheduled',
    result: 'pending',
  },
};

export const secondJob = {
  __typename: 'JobInvocation',
  id: 'MDE6Sm9iSW52b2NhdGlvbi0yNzE=',
  description: 'Run Ansible roles',
  startAt: '2021-06-31T13:37:00+02:00',
  statusLabel: 'succeeded',
  recurringLogic: {
    __typename: 'ForemanTasks::RecurringLogic',
    id: 'MDE6Rm9yZW1hblRhc2tzOjpSZWN1cnJpbmdMb2dpYy0yMw==',
    cronLine: '54 10 15 * *',
  },
  task: {
    __typename: 'ForemanTasks::Task',
    id:
      'MDE6Rm9yZW1hblRhc2tzOjpUYXNrLWY4ZDJkZTU4LWQ3YmMtNGQ5OS05NDZkLTI4NDNlZWRhYzUwZQ==',
    state: 'stopped',
    result: 'success',
  },
};

export const jobInvocationsMockFactory = mockFactory(
  'jobInvocations',
  recurringJobsQuery
);
export const jobCreateMockFactory = mockFactory(
  'createJobInvocation',
  createJobMutation
);

const emptyScheduledJobsMock = jobInvocationsMockFactory(
  { search: scheduledJobsSearch('host', hostId) },
  { nodes: [] }
);
const emptyScheduledJobsRefetchMock = jobInvocationsMockFactory(
  { search: scheduledJobsSearch('host', hostId) },
  { nodes: [] },
  { refetchData: { nodes: [firstJob] } }
);
const emptyPreviousJobsMock = jobInvocationsMockFactory(
  { search: previousJobsSearch('host', hostId) },
  { nodes: [] }
);
const scheduledJobsMocks = jobInvocationsMockFactory(
  { search: scheduledJobsSearch('host', hostId) },
  { nodes: [firstJob] }
);
const previousJobsMocks = jobInvocationsMockFactory(
  { search: previousJobsSearch('host', hostId) },
  { nodes: [secondJob] }
);

export const emptyMocks = emptyScheduledJobsMock.concat(emptyPreviousJobsMock);
export const scheduledAndPreviousMocks = scheduledJobsMocks.concat(
  previousJobsMocks
);

const createJobMock = jobCreateMockFactory(
  toVars('host', hostId, futureDate, 'weekly').variables,
  { jobInvocation: { id: 'MDE6Sm9iSW52b2NhdGlvbi00MTU=' }, errors: [] }
);

export const createMocks = emptyScheduledJobsRefetchMock
  .concat(emptyPreviousJobsMock)
  .concat(createJobMock);
