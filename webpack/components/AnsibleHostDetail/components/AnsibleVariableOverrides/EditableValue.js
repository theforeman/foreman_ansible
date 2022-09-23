import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';

import { formatValue } from './AnsibleVariableOverridesTableHelper';

import {
  TextAreaField,
  TextInputField,
  SelectField,
} from './EditableValueHelper';

const EditableValue = props => {
  if (!props.editing) {
    return formatValue(props.variable);
  }

  const type = props.variable.parameterType;

  if (['json', 'yaml', 'array', 'hash'].includes(type)) {
    return (
      <TextAreaField
        aria-label="Edit override field"
        onChange={props.onChange}
        value={JSON.stringify(props.value)}
        validation={props.validation}
        isDisabled={props.working}
      />
    );
  }

  if (type === 'boolean') {
    return (
      <SelectField
        aria-label="Edit override field"
        selectItems={[
          { id: 'trueSelectOpt', value: true, name: __('true') },
          { id: 'falseSelectOpt', value: false, name: __('false') },
        ]}
        onChange={props.onChange}
        validation={props.validation}
        isDisabled={props.working}
        value={props.value}
      />
    );
  }

  return (
    <TextInputField
      onChange={props.onChange}
      value={props.value}
      validation={props.validation}
      isDisabled={props.working}
      aria-label="Edit override field"
    />
  );
};

EditableValue.propTypes = {
  editing: PropTypes.bool.isRequired,
  variable: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
  validation: PropTypes.object.isRequired,
  working: PropTypes.bool.isRequired,
};

EditableValue.defaultProps = {
  value: '',
};

export default EditableValue;
