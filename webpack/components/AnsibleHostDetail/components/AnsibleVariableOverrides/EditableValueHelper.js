import React from 'react';
import {
  TextInput,
  TextArea,
  FormGroup,
  FormSelect,
  FormSelectOption,
  FormHelperText,
  HelperText,
  HelperTextItem,
} from '@patternfly/react-core';

const withFormGroup = Component => componentProps => {
  const { validation, ...rest } = componentProps;
  return (
    <FormGroup label="">
      <Component {...rest} validated={validation.key} />
      {validation.key === 'error' && (
        <FormHelperText>
          <HelperText>
            <HelperTextItem>{validation.msg}</HelperTextItem>
          </HelperText>
        </FormHelperText>
      )}
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
