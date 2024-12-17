import React from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup,
  FormSelect,
  FormSelectOption,
  DatePicker,
  TimePicker,
  FormHelperText,
  HelperText,
  HelperTextItem,
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
    <FormGroup label={label} isRequired={isRequired}>
      <FormSelect
        ouiaId={`select-${fieldProps.name}`}
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
      {valid === 'error' && (
        <FormHelperText>
          <HelperText>
            <HelperTextItem variant="icon" icon={<ExclamationCircleIcon />}>
              {form.errors[field.name]}
            </HelperTextItem>
          </HelperText>
        </FormHelperText>
      )}
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

const pickerWithHandlers = ComponentType => {
  const Subcomponent = ({ form, field, isRequired, label, ...rest }) => {
    const { onChange, onBlur } = wrapPickerProps(field);
    const valid = shouldValidate(form, field.name);

    const Component = ComponentType === 'date' ? DatePicker : TimePicker;
    return (
      <FormGroup label={label} isRequired={isRequired}>
        <Component
          aria-label={field.name}
          onChange={(e, value) => {
            onChange(value);
          }}
          onBlur={onBlur}
          {...rest}
          validated={valid}
          isDisabled={form.isSubmitting}
        />
        {valid === 'error' && (
          <FormHelperText>
            <HelperText>
              <HelperTextItem variant="icon" icon={<ExclamationCircleIcon />}>
                {form.errors[field.name]}
              </HelperTextItem>
            </HelperText>
          </FormHelperText>
        )}
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

export const DatePickerField = pickerWithHandlers('date');
export const TimePickerField = pickerWithHandlers('time');
