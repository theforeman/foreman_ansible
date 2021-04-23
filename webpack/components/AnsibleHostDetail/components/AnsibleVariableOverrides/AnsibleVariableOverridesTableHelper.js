import React from 'react';
import TimesIcon from '@patternfly/react-icons/dist/js/icons/times-icon';
import CheckIcon from '@patternfly/react-icons/dist/js/icons/check-icon';
import { Link } from 'react-router-dom';
import { translate as __ } from 'foremanReact/common/I18n';

const formatSourceLink = (hostAttrs, variable) => {
  const value = `${variable.currentValue.element}: ${variable.currentValue.elementName}`;
  let { element } = variable.currentValue;

  const knownMatchResources = ['os', 'hostgroup', 'domain'];

  if (!knownMatchResources.includes(element)) {
    return value;
  }

  if (element === 'os') {
    element = 'operatingsystem';
  }

  const elementId = hostAttrs[`${element}_id`];

  if (elementId) {
    return <Link to={`/${element}s/${elementId}/edit`}>{value}</Link>;
  }
  return value;
};

export const formatSourceAttr = (hostAttrs, variable) =>
  variable.currentValue
    ? formatSourceLink(hostAttrs, variable)
    : __('Default value');

export const formatValue = variable => {
  const value = variable.currentValue
    ? variable.currentValue.value
    : variable.defaultValue;
  if (variable.parameterType === 'boolean') {
    return value ? <CheckIcon /> : <TimesIcon />;
  }
  const type = variable.parameterType;
  if (type === 'yaml' || type === 'hash' || type === 'array') {
    return JSON.stringify(value);
  }
  return value;
};
