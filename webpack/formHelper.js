import React from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  FormSelect,
  FormSelectOption,
  DatePicker,
  TimePicker,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

const wrapFieldProps = fieldProps => {
  const { onChange } = fieldProps;
  // modify onChange args to correctly wire formik with pf4 input handlers
  const wrappedOnChange = (value, event) => {
    onChange(event);
  };

  return { ...fieldProps, onChange: wrappedOnChange };
};

const wrapPickerProps = fieldProps => {
  const { onChange } = fieldProps;
  // because pf4 does not provide consistent handlers for its inputs
  const wrappedOnChange = value => {
    onChange({ target: { name: fieldProps.name, value } });
  };

  return { ...fieldProps, onChange: wrappedOnChange };
};

const shouldValidate = (form, fieldName) => {
  if (form.touched[fieldName]) {
    return form.errors[fieldName] ? 'error' : 'success';
  }

  return 'noval';
};

export const SelectField = ({
  selectItems,
  field,
  form,
  label,
  isRequired,
  blankLabel,
}) => {
  const fieldProps = wrapFieldProps(field);

  const valid = shouldValidate(form, field.name);

  return (
    <FormGroup
      label={label}
      isRequired={isRequired}
      helperTextInvalid={form.errors[field.name]}
      helperTextInvalidIcon={<ExclamationCircleIcon />}
      validated={valid}
    >
      <FormSelect
        {...fieldProps}
        className="without_select2"
        aria-label={fieldProps.name}
        validated={valid}
        isDisabled={form.isSubmitting}
      >
        <FormSelectOption key={0} value="" label={blankLabel} />
        {selectItems.map((item, idx) => (
          <FormSelectOption key={idx + 1} value={item.id} label={item.name} />
        ))}
      </FormSelect>
    </FormGroup>
  );
};

SelectField.propTypes = {
  selectItems: PropTypes.array,
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  blankLabel: PropTypes.string,
  isRequired: PropTypes.bool,
};

SelectField.defaultProps = {
  selectItems: [],
  isRequired: false,
  blankLabel: '',
};

const pickerWithHandlers = Component => {
  const Subcomponent = ({ form, field, isRequired, label, ...rest }) => {
    const { onChange, onBlur } = wrapPickerProps(field);
    const valid = shouldValidate(form, field.name);

    return (
      <FormGroup
        label={label}
        isRequired={isRequired}
        helperTextInvalid={form.errors[field.name]}
        helperTextInvalidIcon={<ExclamationCircleIcon />}
        validated={valid}
      >
        <Component
          aria-label={field.name}
          onChange={onChange}
          onBlur={onBlur}
          {...rest}
          validated={valid}
          isDisabled={form.isSubmitting}
        />
      </FormGroup>
    );
  };

  Subcomponent.propTypes = {
    form: PropTypes.object.isRequired,
    field: PropTypes.object.isRequired,
    isRequired: PropTypes.bool,
    label: PropTypes.string.isRequired,
  };

  Subcomponent.defaultProps = {
    isRequired: false,
  };

  return Subcomponent;
};

export const DatePickerField = pickerWithHandlers(DatePicker);
export const TimePickerField = pickerWithHandlers(TimePicker);
