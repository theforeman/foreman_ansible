import { scheduledJobsSearch, previousJobsSearch } from '../JobsTabHelper';
import { admin, mockFactory, userFactory } from '../../../../../testHelper';

import recurringJobsQuery from '.../../../../graphql/queries/recurringJobs.gql';
import createJobMutation from '../../../../../graphql/mutations/createJobInvocation.gql';
import cancelRecurringLogicMutation from '../../../../../graphql/mutations/cancelRecurringLogic.gql';

import { toVars, toCron } from '../NewRecurringJobHelper';

export const hostId = 3;

const today = new Date();
const futureDate = new Date(today.setDate(today.getDate() + 3));
futureDate.setMilliseconds(0);
futureDate.setSeconds(0);
export { futureDate };

const viewer = userFactory('viewer', [
  { id: 'MDE6UGVybWlzc2lvbi0zMjE=', name: 'view_recurring_logics' },
  { id: 'MDE6UGVybWlzc2lvbi0yNTg=', name: 'view_job_invocations' },
  { id: 'MDE6UGVybWlzc2lvbi0xNzg=', name: 'view_foreman_tasks' },
]);

const firstRecurringLogicGlobalId =
  'MDE6Rm9yZW1hblRhc2tzOjpSZWN1cnJpbmdMb2dpYy0x';

const firstRecurringLogic = {
  __typename: 'ForemanTasks::RecurringLogic',
  id: firstRecurringLogicGlobalId,
  cronLine: toCron(futureDate, 'weekly'),
  purpose: '',
  meta: {
    canEdit: true,
  },
};

const secondRecurringLogic = {
  ...firstRecurringLogic,
  id: 'MDE6Rm9yZW1hblRhc2tzOjpSZWN1cnJpbmdMb2dpYy03NQ==',
  meta: {
    canEdit: false,
  },
};

export const firstJob = {
  __typename: 'JobInvocation',
  id: 'MDE6Sm9iSW52b2NhdGlvbi0yNTY=',
  description: 'Run Ansible roles',
  startAt: futureDate.toISOString(),
  statusLabel: 'queued',
  recurringLogic: firstRecurringLogic,
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
    purpose: '',
    meta: {
      canEdit: true,
    },
  },
  task: {
    __typename: 'ForemanTasks::Task',
    id:
      'MDE6Rm9yZW1hblRhc2tzOjpUYXNrLWY4ZDJkZTU4LWQ3YmMtNGQ5OS05NDZkLTI4NDNlZWRhYzUwZQ==',
    state: 'stopped',
    result: 'success',
  },
};

export const thirdJob = {
  ...firstJob,
  id: 'MDE6Sm9iSW52b2NhdGlvbi00NDg=',
  recurringLogic: secondRecurringLogic,
};

export const jobInvocationsMockFactory = mockFactory(
  'jobInvocations',
  recurringJobsQuery
);
export const jobCreateMockFactory = mockFactory(
  'createJobInvocation',
  createJobMutation
);

const jobCancelMockFactory = mockFactory(
  'cancelRecurringLogic',
  cancelRecurringLogicMutation
);

const emptyScheduledJobsMock = jobInvocationsMockFactory(
  { search: scheduledJobsSearch('host', hostId) },
  { nodes: [], totalCount: 0 },
  { currentUser: admin }
);
const emptyScheduledViewerMock = jobInvocationsMockFactory(
  { search: scheduledJobsSearch('host', hostId) },
  { nodes: [], totalCount: 0 },
  { currentUser: viewer }
);
const scheduledViewerMock = jobInvocationsMockFactory(
  { search: scheduledJobsSearch('host', hostId) },
  { nodes: [thirdJob], totalCount: 1 },
  { currentUser: viewer }
);
const emptyScheduledJobsRefetchMock = jobInvocationsMockFactory(
  { search: scheduledJobsSearch('host', hostId) },
  { nodes: [], totalCount: 0 },
  { refetchData: { nodes: [firstJob], totalCount: 1 }, currentUser: admin }
);
const emptyPreviousJobsMock = jobInvocationsMockFactory(
  { search: previousJobsSearch('host', hostId), first: 20, last: 20 },
  { nodes: [], totalCount: 0 },
  { currentUser: admin }
);
const emptyPreviousViewerMock = jobInvocationsMockFactory(
  { search: previousJobsSearch('host', hostId) },
  { nodes: [], totalCount: 0 },
  { currentUser: viewer }
);
const scheduledJobsMocks = jobInvocationsMockFactory(
  { search: scheduledJobsSearch('host', hostId) },
  { nodes: [firstJob], totalCount: 1 },
  { currentUser: admin }
);
const previousJobsMocks = jobInvocationsMockFactory(
  { search: previousJobsSearch('host', hostId), first: 20, last: 20 },
  { nodes: [secondJob], totalCount: 1 },
  { currentUser: admin }
);

export const emptyMocks = emptyScheduledJobsMock.concat(emptyPreviousJobsMock);
export const emptyViewerMocks = emptyScheduledViewerMock.concat(
  emptyPreviousViewerMock
);

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

const scheduledWithRefetch = jobInvocationsMockFactory(
  { search: scheduledJobsSearch('host', hostId) },
  { nodes: [firstJob], totalCount: 1 },
  { refetchData: { nodes: [], totalCount: 0 }, currentUser: admin }
);

const previousWithRefetch = jobInvocationsMockFactory(
  { search: previousJobsSearch('host', hostId), first: 20, last: 20 },
  { nodes: [], totalCount: 0 },
  { refetchData: { nodes: [firstJob], totalCount: 1 }, currentUser: admin }
);

const cancelJobMock = jobCancelMockFactory(
  { id: firstRecurringLogicGlobalId },
  { recurringLogic: firstRecurringLogic, errors: [] }
);

export const cancelMocks = scheduledWithRefetch
  .concat(previousWithRefetch)
  .concat(cancelJobMock);

export const cancelViewerMocks = scheduledViewerMock.concat(
  emptyPreviousViewerMock
);
