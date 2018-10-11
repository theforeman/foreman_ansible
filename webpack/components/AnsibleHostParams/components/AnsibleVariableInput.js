import React from 'react';

import { Popover, OverlayTrigger, Button, Icon } from 'patternfly-react';

import UnhideButton from './UnhideButton';
import OverrideButton from './OverrideButton';
import ButtonHelpPopover from './ButtonHelpPopover';
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
  keyWarnings }) => {
  return (
    <div className='input-group'>
      <span className="input-group-addon">
        <KeyInfoPopover lookupKey={lookupKey} lookupValue={lookupValue} hidden={fieldHiddenValue} keyWarnings={keyWarnings} />
      </span>
      <textarea className={`form-control no-stretch ${fieldHiddenValue ? 'masked-input' : ''}`}
                rows="1"
                value={fieldValue}
                name={`host[lookup_values_attributes][${lookupKey.id}][value]`}
                onChange={(e) => updateFieldValue(e.target.value)}
                disabled={fieldDisabled}/>
      <span className="input-group-btn">
        <UnhideButton toggleHidden={toggleHidden} hidden={fieldHiddenValue} lookupKey={lookupKey} />
        <OverrideButton toggleField={toggleOverride} fieldOverriden={fieldOverriden} keyId={lookupKey.id} />
      </span>
    </div>
  );
}

export default AnsibleVariableInput;
