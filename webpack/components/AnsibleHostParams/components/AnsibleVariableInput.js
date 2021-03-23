import React from 'react';
import PropTypes from 'prop-types';

import { overrideFieldName } from './AnsibleVariableHelpers';
import UnhideButton from './UnhideButton';
import OverrideButton from './OverrideButton';
import KeyInfoPopover from './KeyInfoPopover';

const AnsibleVariableInput = ({
  fieldDisabled,
  toggleOverride,
  fieldOverriden,
  lookupKey,
  lookupValue,
  fieldValue,
  updateFieldValue,
  toggleHidden,
  fieldHiddenValue,
  formModelField,
  keyErrors,
}) => (
  <div className="input-group">
    <span className="input-group-addon">
      <KeyInfoPopover
        lookupKey={lookupKey}
        hidden={fieldHiddenValue}
        keyErrors={keyErrors}
      />
    </span>
    <textarea
      className={`form-control no-stretch ${
        fieldHiddenValue ? 'masked-input' : ''
      }`}
      rows="1"
      value={fieldValue}
      name={overrideFieldName(lookupKey, 'value', formModelField)}
      onChange={e => updateFieldValue(e.target.value)}
      disabled={fieldDisabled}
    />
    <span className="input-group-btn">
      <UnhideButton
        toggleHidden={toggleHidden}
        hidden={fieldHiddenValue}
        lookupKey={lookupKey}
      />
      <OverrideButton
        toggleField={toggleOverride}
        fieldOverriden={fieldOverriden}
        keyId={lookupKey.id}
      />
    </span>
  </div>
);

AnsibleVariableInput.propTypes = {
  fieldDisabled: PropTypes.bool.isRequired,
  toggleOverride: PropTypes.func.isRequired,
  fieldOverriden: PropTypes.bool.isRequired,
  lookupKey: PropTypes.object.isRequired,
  lookupValue: PropTypes.object.isRequired,
  fieldValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  updateFieldValue: PropTypes.func.isRequired,
  toggleHidden: PropTypes.func.isRequired,
  fieldHiddenValue: PropTypes.bool.isRequired,
  formModelField: PropTypes.string.isRequired,
  keyErrors: PropTypes.object.isRequired,
};

export default AnsibleVariableInput;
