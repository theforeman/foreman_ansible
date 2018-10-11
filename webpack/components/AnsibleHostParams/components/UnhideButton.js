import React from 'react';

import { Button } from 'patternfly-react';

import ButtonHelpPopover from './ButtonHelpPopover';

const UnhideButton = ({ toggleHidden, hidden, lookupKey }) => {
  if (!lookupKey.hiddenValue) {
    return '';
  }

  let faIcon, popoverText, popoverId;

  const keyId = lookupKey.id

  if (hidden) {
    popoverText = __('Unhide this value');
    popoverId = `lookup-key-unhide-value-${keyId}`;
  } else {
    popoverText = __('Hide this value');
    popoverId = `lookup-key-hide-value-${keyId}`;
    faIcon = 'btn-strike';
  }

  const button = (
    <Button name="button" type="button" className="btn btn-default btn-md btn-hide" onClick={toggleHidden}>
      <span className={`fa fa-font ${faIcon}`}></span>
    </Button>
  )

  return <ButtonHelpPopover button={button} popoverText={popoverText} popoverId={popoverId} />
}

export default UnhideButton;
