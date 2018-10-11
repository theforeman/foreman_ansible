import React from 'react';

import { Button } from 'patternfly-react';

import ButtonHelpPopover from './ButtonHelpPopover';

const OverrideButton = ({ toggleField, fieldOverriden, keyId }) => {
  let faIcon, popoverText, popoverId;

  if (!fieldOverriden) {
    faIcon = 'fa-pencil-square-o';
    popoverText = __('Override this value');
    popoverId = `lookup-key-add-override-${keyId}`
  } else {
    faIcon = 'fa-times';
    popoverText = __('Remove this override');
    popoverId = `lookup-key-remove-override-${keyId}`
  }

  const button = (
    <Button name="button" type="button" className="btn btn-default btn-md btn-override" onClick={toggleField}>
      <span className={`fa ${faIcon}`}></span>
    </Button>
  );

  return <ButtonHelpPopover button={button} popoverText={popoverText} popoverId={popoverId} />;
}

export default OverrideButton;
