import React from 'react';
import { TimesIcon, CheckIcon } from '@patternfly/react-icons';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';

import { showToast } from '../../../../toastHelper';

function formatSourceLink(currentValue) {
  const element =
    typeof currentValue.element !== 'string'
      ? currentValue.element.toString()
      : currentValue.element;
  return `${__(element)}: ${currentValue.elementName}`;
}

//here we can add the condition for hidden value to "*****"
export const formatSourceAttr = variable =>
  variable.currentValue
    ? formatSourceLink(variable.currentValue)
    : __('Default value');

export const formatValue = variable => {
  const value = variable.currentValue
    ? variable.currentValue.value
    : variable.defaultValue;
  if (variable.hiddenValue) {
    return '••••••••';
  }
  switch (variable.parameterType) {
    case 'boolean':
      return value ? <CheckIcon /> : <TimesIcon />;
    case 'yaml':
    case 'hash':
    case 'array':
    case 'json':
      return JSON.stringify(value);
    default:
      return value;
  }
};

const joinErrors = errors => errors.map(err => err.message).join(', ');

export const onCompleted = onSubmitSuccess => response => {
  const {
    errors,
    overridenAnsibleVariable,
  } = response.data.deleteAnsibleVariableOverride;
  if (Array.isArray(errors) && errors.length > 0) {
    showToast({
      type: 'error',
      message: formatError(joinErrors(errors)),
    });
  } else {
    onSubmitSuccess(overridenAnsibleVariable.currentValue.value);
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

export const onError = response => {
  showToast({ type: 'error', message: formatError(response.error) });
};

const validationSuccess = { key: 'success', msg: '' };

const validateRegexp = (variable, value) => {
  if (new RegExp(variable.validatorRule).test(value)) {
    return validationSuccess;
  }
  return {
    key: 'error',
    msg: sprintf(
      __('Invalid, expected to match a regex: %s'),
      variable.validatorRule
    ),
  };
};

const validateList = (variable, value) => {
  let { validatorRule } = variable;
  if (typeof validatorRule !== 'string') {
    validatorRule = validatorRule.toString();
  }
  if (validatorRule.split(',').find(item => item.trim() === value)) {
    return validationSuccess;
  }
  return {
    key: 'error',
    msg: sprintf(__('Invalid, expected one of: %s'), validatorRule),
  };
};

export const validateValue = (variable, value) => {
  if (variable.required && !value) {
    return { key: 'error', msg: __('is required') };
  }

  if (variable.validatorType === 'regexp') {
    return validateRegexp(variable, value);
  }

  if (variable.validatorType === 'list') {
    return validateList(variable, value);
  }

  return { key: 'noval', msg: '' };
};
