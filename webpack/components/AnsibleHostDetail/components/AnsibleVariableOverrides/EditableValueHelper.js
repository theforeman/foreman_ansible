import React from 'react';
import {
  TextInput,
  TextArea,
  FormGroup,
  FormSelect,
  FormSelectOption,
} from '@patternfly/react-core';

const withFormGroup = Component => componentProps => {
  const { validation, ...rest } = componentProps;
  return (
    <FormGroup
      label=""
      helperTextInvalid={validation.msg}
      validated={validation.key}
    >
      <Component {...rest} validated={validation.key} />
    </FormGroup>
  );
};

export const SelectField = componentProps => {
  const { selectItems, ...rest } = componentProps;
  return (
    <FormSelect
      className="without_select2"
      ouiaId="without-form-select"
      {...rest}
    >
      {selectItems.map(item => (
        <FormSelectOption key={item.id} value={item.value} label={item.name} />
      ))}
    </FormSelect>
  );
};

export const TextInputField = withFormGroup(TextInput);
export const TextAreaField = withFormGroup(TextArea);
