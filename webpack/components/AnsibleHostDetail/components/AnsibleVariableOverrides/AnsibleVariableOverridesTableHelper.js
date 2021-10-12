import React from 'react';
import { TimesIcon, CheckIcon } from '@patternfly/react-icons';
import { useMutation } from '@apollo/client';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';

import deleteAnsibleVariableOverride from '../../../../graphql/mutations/deleteAnsibleVariableOverride.gql';
import { showToast } from '../../../../toastHelper';

const formatSourceLink = currentValue =>
  `${__(currentValue.element)}: ${currentValue.elementName}`;

export const formatSourceAttr = variable =>
  variable.currentValue
    ? formatSourceLink(variable.currentValue)
    : __('Default value');

export const formatValue = variable => {
  const value = variable.currentValue
    ? variable.currentValue.value
    : variable.defaultValue;

  switch (variable.parameterType) {
    case 'boolean':
      return value ? <CheckIcon /> : <TimesIcon />;
    case 'yaml':
    case 'hash':
    case 'array':
      return JSON.stringify(value);
    default:
      return value;
  }
};

const joinErrors = errors => errors.map(err => err.message).join(', ');

const onCompleted = closeModal => data => {
  closeModal();
  const { errors } = data.deleteAnsibleVariableOverride;
  if (Array.isArray(errors) && errors.length > 0) {
    showToast({
      type: 'error',
      message: formatError(joinErrors(errors)),
    });
  } else {
    showToast({
      type: 'success',
      message: __('Ansible variable override was successfully deleted.'),
    });
  }
};

export const findOverride = (variable, hostname) =>
  variable.lookupValues.nodes.find(
    item =>
      item.value === variable.currentValue.value &&
      item.match === `fqdn=${hostname}`
  );

const formatError = error =>
  sprintf(
    __(
      'There was a following error when deleting Ansible variable override: %s'
    ),
    error
  );

const onError = error => {
  showToast({ type: 'error', message: formatError(error) });
};

export const usePrepareMutation = toggleModal =>
  useMutation(deleteAnsibleVariableOverride, {
    onCompleted: onCompleted(toggleModal),
    onError,
  });
