import { useQuery, useMutation } from '@apollo/client';
import { translate as __, sprintf } from 'foremanReact/common/I18n';
import jobsQuery from '../../../../graphql/queries/recurringJobs.gql';
import cancelRecurringLogic from '../../../../graphql/mutations/cancelRecurringLogic.gql';
import { showToast } from '../../../../toastHelper';

export const ansiblePurpose = (resourceName, resourceId) =>
  `ansible-${resourceName}-${resourceId}`;

const jobSearch = (resourceName, resourceId, status, hostGroupId) => {
  const search = `recurring = true && pattern_template_name = "Ansible Roles - Ansible Default"`;
  const searchStatus = ` && ${status}`;
  const searchHost = ` && recurring_logic.purpose = ${ansiblePurpose(
    resourceName,
    resourceId
  )}`;
  const searchHostGroup = hostGroupId
    ? ` or recurring_logic.purpose = ${ansiblePurpose(
        'hostgroup',
        hostGroupId
      )}`
    : '';

  return search + searchStatus + searchHost + searchHostGroup;
};

export const scheduledJobsSearch = (resourceName, resourceId, hostGroupId) =>
  jobSearch(resourceName, resourceId, 'status = queued', hostGroupId);
export const previousJobsSearch = (resourceName, resourceId, hostGroupId) =>
  jobSearch(resourceName, resourceId, 'status != queued', hostGroupId);

const fetchJobsFn = (searchFn, pagination = {}) => componentProps =>
  useQuery(jobsQuery, {
    variables: {
      search: searchFn(
        componentProps.resourceName,
        componentProps.resourceId,
        componentProps.hostGroupId
      ),
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

export const joinErrors = errors => errors.map(err => err.message).join(', ');

const formatError = error =>
  sprintf(
    __('There was a following error when deleting Ansible config job: %s'),
    error
  );

const onError = error => {
  showToast({ type: 'danger', message: formatError(error) });
};

const onCompleted = data => {
  const { errors } = data.cancelRecurringLogic;
  if (Array.isArray(errors) && errors.length > 0) {
    showToast({
      type: 'danger',
      message: formatError(joinErrors(errors)),
    });
  } else {
    showToast({
      type: 'success',
      message: __('Ansible job was successfully canceled.'),
    });
  }
};

export const useCancelMutation = (resourceName, resourceId) =>
  useMutation(cancelRecurringLogic, {
    onCompleted,
    onError,
    refetchQueries: [
      {
        query: jobsQuery,
        variables: { search: previousJobsSearch(resourceName, resourceId) },
      },
      {
        query: jobsQuery,
        variables: { search: scheduledJobsSearch(resourceName, resourceId) },
      },
    ],
  });

export const readableCron = (cron = '') => {
  if (cron.match(/(\d+ \* \* \* \*)/)) {
    return 'hourly';
  }

  if (cron.match(/(\d+ \d+ \* \* \*)/)) {
    return 'daily';
  }

  if (cron.match(/(\d+ \d+ \* \* \d+)/)) {
    return 'weekly';
  }

  if (cron.match(/(\d+ \d+ \d+ \* \*)/)) {
    return 'monthly';
  }

  return 'custom';
};

export const readablePurpose = (purpose = '') => {
  if (window.location.href.match(/ansible\/hostgroup/)) {
    return '';
  }
  return purpose.match(/hostgroup/) ? __('(from host group)') : '';
};
