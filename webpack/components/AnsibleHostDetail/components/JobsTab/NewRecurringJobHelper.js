import * as Yup from 'yup';
import { translate as __, sprintf } from 'foremanReact/common/I18n';

import { showToast } from '../../../../toastHelper';
import { ansiblePurpose } from './JobsTabHelper';

export const frequencyOpts = [
  { id: 'hourly', name: __('hourly') },
  { id: 'daily', name: __('daily') },
  { id: 'weekly', name: __('weekly') },
  { id: 'monthly', name: __('monthly') },
];

export const rangeValidator = date => {
  if (date < new Date()) {
    return __('Must not be in the past');
  }
  return '';
};

export const createValidationSchema = () => {
  const cantBeBlank = __("can't be blank");

  return Yup.object().shape({
    repeat: Yup.string().required(cantBeBlank),
    startTime: Yup.string().required(cantBeBlank),
    startDate: Yup.string().required(cantBeBlank),
  });
};

export const toCron = (date, repeat) => {
  switch (repeat) {
    case 'hourly':
      return `${date.getMinutes()} * * * *`;
    case 'daily':
      return `${date.getMinutes()} ${date.getHours()} * * *`;
    case 'weekly':
      return `${date.getMinutes()} ${date.getHours()} * * ${date.getDay()}`;
    case 'monthly':
      return `${date.getMinutes()} ${date.getHours()} ${date.getDate()} * *`;
    default:
      return `${date.getMinutes()} * * * *`;
  }
};

export const toVars = (resourceName, resourceId, date, repeat) => {
  const targeting =
    resourceName === 'host'
      ? { hostId: resourceId }
      : { searchQuery: `hostgroup_id = ${resourceId}` };

  return {
    variables: {
      jobInvocation: {
        ...targeting,
        feature: 'ansible_run_host',
        targetingType: 'static_query',
        scheduling: {
          startAt: date,
        },
        recurrence: {
          cronLine: toCron(date, repeat),
          purpose: ansiblePurpose(resourceName, resourceId),
        },
      },
    },
  };
};

const joinErrors = errors => errors.map(err => err.message).join(', ');

const formatError = error =>
  sprintf(
    __('There was a following error when creating Ansible job: %s'),
    error
  );

export const onSubmit = (callMutation, onClose, resourceName, resourceId) => (
  values,
  actions
) => {
  const onCompleted = response => {
    actions.setSubmitting(false);
    const { errors } = response.data.createJobInvocation;
    if (Array.isArray(errors) && errors.length > 0) {
      showToast({
        type: 'danger',
        message: formatError(joinErrors(errors)),
      });
    } else {
      onClose();
      showToast({
        type: 'success',
        message: __('Ansible job was successfully created.'),
      });
    }
  };

  const onError = error => {
    actions.setSubmitting(false);
    showToast({ type: 'danger', message: formatError(error) });
  };

  const date = new Date(`${values.startDate}T${values.startTime}`);
  const variables = toVars(resourceName, resourceId, date, values.repeat);
  // eslint-disable-next-line promise/prefer-await-to-then
  callMutation(variables).then(onCompleted, onError);
};
