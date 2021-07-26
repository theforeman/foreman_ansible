import React from 'react';
import { TimesIcon, CheckIcon } from '@patternfly/react-icons';
import { translate as __ } from 'foremanReact/common/I18n';

const formatSourceLink = (hostAttrs, { currentValue }) =>
  `${__(currentValue.element)}: ${currentValue.elementName}`;

export const formatSourceAttr = (hostAttrs, variable) =>
  variable.currentValue
    ? formatSourceLink(hostAttrs, variable)
    : __('Default value');

export const formatValue = variable => {
  const value = variable.currentValue?.value || variable.defaultValue;

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
