import { documentLocale } from 'foremanReact/common/I18n';
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

export const formatJobStart = start => {
  const diff = timeDiff(start);
  const timeFormatter = new Intl.RelativeTimeFormat(documentLocale(), {
    style: 'narrow',
  });
  return timeFormatter.format(diff.value, diff.units);
};

const timeDiff = start => {
  const inMinutes = (Date.parse(start) - Date.now()) / (1000 * 60);
  if (Math.abs(inMinutes) < 60) {
    return { value: Math.floor(inMinutes), units: 'minutes' };
  }
  const inHours = inMinutes / 60;
  if (Math.abs(inHours) < 60) {
    return { value: Math.floor(inHours), units: 'hours' };
  }
  return { value: Math.floor(inHours / 24), units: 'days' };
};
