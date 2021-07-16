import React from 'react';
import { TimesIcon, CheckIcon } from '@patternfly/react-icons';
import { Link } from 'react-router-dom';
import { translate as __ } from 'foremanReact/common/I18n';

const formatSourceLink = (hostAttrs, { currentValue }) => {
  const value = `${__(currentValue.element)}: ${currentValue.elementName}`;
  let { element } = currentValue;
  const { meta } = currentValue;

  const knownMatchResources = ['os', 'hostgroup', 'domain'];

  if (!knownMatchResources.includes(element)) {
    return value;
  }

  if (element === 'os') {
    element = 'operatingsystem';
  }

  const elementId = hostAttrs[`${element}_id`];

  if (elementId && meta?.canEdit) {
    return <Link to={`/${element}s/${elementId}/edit`}>{value}</Link>;
  }
  return value;
};

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
