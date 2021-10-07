import { useQuery } from '@apollo/client';
import jobsQuery from '../../../../graphql/queries/jobInvocations.gql';

const jobSearch = (hostId, statusSearch) =>
  `recurring = true && targeted_host_id = ${hostId} && pattern_template_name = "Ansible Roles - Ansible Default" && ${statusSearch}`;

export const scheduledJobsSearch = hostId =>
  jobSearch(hostId, 'status = queued');
export const previousJobsSearch = hostId =>
  jobSearch(hostId, 'status != queued');

const fetchJobsFn = searchFn => componentProps =>
  useQuery(jobsQuery, {
    variables: { search: searchFn(componentProps.response.id) },
  });

export const fetchRecurringFn = fetchJobsFn(scheduledJobsSearch);
export const fetchPreviousFn = fetchJobsFn(previousJobsSearch);

export const renameData = data => ({
  jobs: data.jobInvocations.nodes,
});
