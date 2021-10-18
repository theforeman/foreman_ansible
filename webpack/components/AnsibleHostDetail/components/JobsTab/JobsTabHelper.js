import { useQuery } from '@apollo/client';
import jobsQuery from '../../../../graphql/queries/recurringJobs.gql';

export const ansiblePurpose = (resourceName, resourceId) =>
  `ansible-${resourceName}-${resourceId}`;

const jobSearch = (resourceName, resourceId, statusSearch) =>
  `recurring = true && pattern_template_name = "Ansible Roles - Ansible Default" && ${statusSearch} && recurring_logic.purpose = ${ansiblePurpose(
    resourceName,
    resourceId
  )}`;

export const scheduledJobsSearch = (resourceName, resourceId) =>
  jobSearch(resourceName, resourceId, 'status = queued');
export const previousJobsSearch = (resourceName, resourceId) =>
  jobSearch(resourceName, resourceId, 'status != queued');

const fetchJobsFn = (searchFn, pagination = {}) => componentProps =>
  useQuery(jobsQuery, {
    variables: {
      search: searchFn(componentProps.resourceName, componentProps.resourceId),
      ...pagination,
    },
  });

export const fetchRecurringFn = fetchJobsFn(scheduledJobsSearch);
export const fetchPreviousFn = pagination =>
  fetchJobsFn(previousJobsSearch, pagination);

export const renameData = data => ({
  jobs: data.jobInvocations.nodes,
  totalCount: data.jobInvocations.totalCount,
});
