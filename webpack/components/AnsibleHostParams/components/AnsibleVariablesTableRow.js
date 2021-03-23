import React, { useState } from 'react';
import { lowerCase } from 'lodash';
import PropTypes from 'prop-types';

import AnsibleVariableInput from './AnsibleVariableInput';
import {
  overrideFieldName,
  updateFieldDisabled,
  fieldElement,
  constructId,
  roleNameColumn,
  initLookupValue,
  sanitizeFormValue,
  sanitizeFieldValue,
  lookupKeyValidations,
  shouldDestroy,
  shouldAddFields,
} from './AnsibleVariableHelpers';

const AnsibleVariablesTableRow = ({
  lookupKey,
  resourceError,
  role,
  firstKey,
  formObject,
}) => {
  const [lookupValue] = useState(initLookupValue(lookupKey, formObject));
  const [dirty, setDirty] = useState(false);
  const [fieldOverriden, setFieldOverriden] = useState(
    resourceError ? true : lookupValue.overriden
  );
  const [fieldOmmited, setFieldOmmited] = useState(
    resourceError ? false : lookupValue.omit
  );
  const [fieldValue, setFieldValue] = useState(
    resourceError ? resourceError.value : sanitizeFieldValue(lookupValue)
  );

  const [fieldDisabled, setFieldDisabled] = useState(
    resourceError
      ? false
      : updateFieldDisabled(lookupValue.overriden, lookupValue.omit)
  );
  const [fieldHiddenValue, setFieldHiddenValue] = useState(
    lookupKey.hiddenValue
  );

  const toggleOverride = () => {
    const isOverriden = !fieldOverriden;
    setFieldOverriden(isOverriden);

    setFieldValue(
      sanitizeFormValue(isOverriden ? fieldValue : lookupValue.value)
    );
    setFieldDisabled(updateFieldDisabled(!fieldOverriden, fieldOmmited));
  };

  const toggleOmit = () => {
    setFieldOmmited(!fieldOmmited);
    setFieldDisabled(updateFieldDisabled(fieldOverriden, !fieldOmmited));
  };

  const toggleHidden = () => setFieldHiddenValue(!fieldHiddenValue);

  const updateFieldValue = value => {
    setDirty(true);
    setFieldValue(value);
  };

  const keyErrors = lookupKeyValidations(
    lookupKey,
    fieldValue,
    fieldDisabled,
    resourceError,
    dirty
  );

  const formModelField = fieldElement(lowerCase(formObject.resourceName));

  return (
    <tr
      id={constructId(role, lookupKey)}
      className="fields overriden"
      key={lookupKey.id}
    >
      {firstKey && lookupKey.id === firstKey.id ? roleNameColumn(role) : null}
      <td className="elipsis param_name">{lookupKey.parameter}</td>
      <td className="elipsis">{lookupKey.parameterType}</td>
      <td className={!keyErrors.valid && !fieldDisabled ? 'has-error' : ''}>
        <AnsibleVariableInput
          role={role}
          lookupKey={lookupKey}
          lookupValue={lookupValue}
          updateFieldValue={updateFieldValue}
          toggleOverride={toggleOverride}
          toggleHidden={toggleHidden}
          fieldDisabled={fieldDisabled}
          fieldOverriden={fieldOverriden}
          fieldOmmited={fieldOmmited}
          fieldHiddenValue={fieldHiddenValue}
          fieldValue={fieldValue}
          formModelField={formModelField}
          keyErrors={keyErrors}
        />
        <span className="help-block">{!fieldDisabled && keyErrors.msg}</span>
      </td>
      <td className="ca">
        <input
          type="checkbox"
          onChange={toggleOmit}
          checked={fieldOmmited}
          value={setFieldOmmited ? '1' : '0'}
          hidden={!fieldOverriden ? 'hidden' : undefined}
          name={overrideFieldName(lookupKey, 'omit', formModelField)}
        />

        <input
          type="hidden"
          name={overrideFieldName(lookupKey, 'lookup_key_id', formModelField)}
          value={lookupKey.id}
          disabled={!shouldAddFields(lookupValue, fieldDisabled, fieldOmmited)}
        />
        <input
          type="hidden"
          name={overrideFieldName(lookupKey, 'id', formModelField)}
          value={lookupValue.id}
          disabled={!shouldAddFields(lookupValue, fieldDisabled, fieldOmmited)}
        />
        <input
          type="hidden"
          name={overrideFieldName(lookupKey, '_destroy', formModelField)}
          value={shouldDestroy(lookupValue, fieldDisabled, fieldOmmited)}
          disabled={!shouldAddFields(lookupValue, fieldDisabled, fieldOmmited)}
        />
      </td>
    </tr>
  );
};

AnsibleVariablesTableRow.propTypes = {
  lookupKey: PropTypes.object.isRequired,
  resourceError: PropTypes.object,
  role: PropTypes.object.isRequired,
  firstKey: PropTypes.object.isRequired,
  formObject: PropTypes.object.isRequired,
};

AnsibleVariablesTableRow.defaultProps = {
  resourceError: null,
};

export default AnsibleVariablesTableRow;
