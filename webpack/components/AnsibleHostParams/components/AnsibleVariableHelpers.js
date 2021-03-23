import React from 'react';
import { find, lowerCase } from 'lodash';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';

export const overrideFieldName = (lookupKey, attr, modelField) =>
  `${modelField}[lookup_values_attributes][${lookupKey.id}][${attr}]`;

export const updateFieldDisabled = (overriden, ommited) =>
  !overriden || ommited;

export const matcherElement = modelName =>
  modelName === 'hostgroup' ? 'hostgroup' : 'fqdn';

export const fieldElement = modelName =>
  modelName === 'hostgroup' ? 'hostgroup' : 'host';

export const constructId = (role, lookupKey) =>
  `ansible_role_${role.id}_params[${lookupKey.id}]`;

export const roleNameColumn = role => (
  <td className="elipsis" rowSpan={role.ansibleVariables.length}>
    {role.name}
  </td>
);

export const initLookupValue = (lookupKey, formObject) => {
  const modelName = lowerCase(formObject.resourceName);
  const valueMatch = matcherElement(modelName);

  if (!lookupKey.currentOverride) {
    return {
      element: valueMatch,
      value: lookupKey.defaultValue,
      omit: false,
      overriden: false,
      defaultValue: lookupKey.defaultValue,
    };
  }

  if (lookupKey.currentOverride.element === valueMatch) {
    const found = find(
      lookupKey.overrideValues,
      value =>
        value.match === `${valueMatch}=${lookupKey.currentOverride.elementName}`
    );

    const override = {
      ...lookupKey.currentOverride,
      id: found.id,
      omit: found.omit,
      overriden: true,
      defaultValue: lookupKey.defaultValue,
    };

    return override;
  }

  return { ...lookupKey.currentOverride, overriden: false, omit: false };
};

export const sanitizeFormValue = val => (val === null ? '' : val);

export const sanitizeFieldValue = lookupValue =>
  sanitizeFormValue(
    lookupValue.value ? lookupValue.value : lookupValue.defaultValue
  );

export const shouldDestroy = (lookupValue, fieldDisabled, fieldOmmited) =>
  lookupValue.overriden && fieldDisabled && !fieldOmmited;

export const shouldAddFields = (lookupValue, fieldDisabled, fieldOmmited) =>
  !fieldDisabled || fieldOmmited || (lookupValue.overriden && fieldDisabled);

export const lookupKeyValidations = (
  lookupKey,
  fieldValue,
  fieldDisabled,
  resourceError,
  dirty
) => {
  const validRes = validOverrideFactory();
  const invalidText = `<b>${__('Please change!')}</b>`;

  const validateValue = (condition, onInvalid) => {
    if (condition(lookupKey.validatorRule, fieldValue)) {
      return validRes;
    }
    return onInvalid;
  };

  if (fieldDisabled) {
    return validRes;
  }

  if (resourceError && fieldValue && !dirty) {
    const errorText = Object.entries(resourceError.errors)
      .reduce((memo, [key, value]) => memo.concat([value]), [])
      .join(', ');
    return invalidOverrideFactory(invalidText, errorText);
  }

  if (lookupKey.required) {
    const pleaseChange = `${__(
      'Required parameter with invalid value.'
    )}<br/><b>${__('Please change!')}</b><br/>`;

    switch (lookupKey.validatorType) {
      case 'None':
        return validateValue(
          (rule, value) => value,
          invalidOverrideFactory(
            `${__('Required parameter without value.')}<br/><b>${__(
              'Please override!'
            )}</b><br/>`,
            __("Value can't be blank")
          )
        );
      case 'regexp': {
        return validateValue(
          (rule, value) => new RegExp(rule).test(value),
          invalidOverrideFactory(
            pleaseChange,
            sprintf(
              __('Invalid value, expected to match a regex: %s'),
              lookupKey.validatorRule
            )
          )
        );
      }
      case 'list':
        return validateValue(
          (rule, value) => rule.split(',').find(item => item.trim() === value),
          invalidOverrideFactory(
            pleaseChange,
            sprintf(
              __('Invalid value, expected one of: %s'),
              lookupKey.validatorRule
            )
          )
        );
      default:
        break;
    }
  }

  if (fieldValue) {
    return validRes;
  }

  return {
    text: `${__('Optional parameter without value.')}<br/><i>${__(
      'Still managed by Foreman, the value will be empty.'
    )}</i><br/>`,
    icon: 'warning-triangle-o',
    valid: true,
  };
};

export const invalidOverrideFactory = (text, msg) => ({
  text,
  icon: 'error-circle-o',
  valid: false,
  msg,
});

export const validOverrideFactory = () => ({
  text: '',
  icon: 'info',
  valid: true,
});

export const showLookupValue = (hidden, lookupKey) => {
  if (hidden) {
    return '*****';
  }

  if (lookupKey.currentOverride) {
    return lookupKey.currentOverride.value;
  }

  return lookupKey.defaultValue;
};

export const formatMatcher = currentOverride =>
  currentOverride
    ? `${currentOverride.element} (${currentOverride.elementName})`
    : 'Default value';
