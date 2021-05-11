import { toVars } from '../../../components/AnsibleHostDetail/components/JobsTab/NewRecurringJobHelper';

import {
  scheduledJobsSearch,
  previousJobsSearch,
} from '../../../components/AnsibleHostDetail/components/JobsTab/JobsTabHelper';
import {
  jobInvocationsMockFactory,
  jobCreateMockFactory,
  firstJob,
  secondJob,
  futureDate,
} from '../../../components/AnsibleHostDetail/components/JobsTab/__test__/JobsTab.fixtures';

export const hgId = 22;
export const matchMock = {
  params: {
    id: '22',
  },
};
export { futureDate };

const emptyScheduledJobsMock = jobInvocationsMockFactory(
  { search: scheduledJobsSearch('hostgroup', hgId) },
  { nodes: [] }
);
const emptyScheduledJobsRefetchMock = jobInvocationsMockFactory(
  { search: scheduledJobsSearch('hostgroup', hgId) },
  { nodes: [] },
  { refetchData: { nodes: [firstJob] } }
);
const emptyPreviousJobsMock = jobInvocationsMockFactory(
  { search: previousJobsSearch('hostgroup', hgId) },
  { nodes: [] }
);
const scheduledJobsMocks = jobInvocationsMockFactory(
  { search: scheduledJobsSearch('hostgroup', hgId) },
  { nodes: [firstJob] }
);
const previousJobsMocks = jobInvocationsMockFactory(
  { search: previousJobsSearch('hostgroup', hgId) },
  { nodes: [secondJob] }
);

export const emptyMocks = emptyScheduledJobsMock.concat(emptyPreviousJobsMock);
export const scheduledAndPreviousMocks = scheduledJobsMocks.concat(
  previousJobsMocks
);

const createJobMock = jobCreateMockFactory(
  toVars('hostgroup', hgId, futureDate, 'weekly').variables,
  { jobInvocation: { id: 'MDE6Sm9iSW52b2NhdGlvbi00MTU=' }, errors: [] }
);

export const createMocks = emptyScheduledJobsRefetchMock
  .concat(emptyPreviousJobsMock)
  .concat(createJobMock);
