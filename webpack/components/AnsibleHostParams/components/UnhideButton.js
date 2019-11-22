import React from 'react';
import { translate as __ } from 'foremanReact/common/I18n';
import PropTypes from 'prop-types';

import { Button } from 'patternfly-react';

import ButtonHelpPopover from './ButtonHelpPopover';

const UnhideButton = ({ toggleHidden, hidden, lookupKey }) => {
  if (!lookupKey.hiddenValue) {
    return '';
  }

  let faIcon;
  let popoverText;
  let popoverId;

  const keyId = lookupKey.id;

  if (hidden) {
    popoverText = __('Unhide this value');
    popoverId = `lookup-key-unhide-value-${keyId}`;
  } else {
    popoverText = __('Hide this value');
    popoverId = `lookup-key-hide-value-${keyId}`;
    faIcon = 'btn-strike';
  }

  const button = (
    <Button
      name="button"
      type="button"
      className="btn btn-default btn-md btn-hide"
      onClick={toggleHidden}
    >
      <span className={`fa fa-font ${faIcon}`} />
    </Button>
  );

  return (
    <ButtonHelpPopover
      button={button}
      popoverText={popoverText}
      popoverId={popoverId}
    />
  );
};

UnhideButton.propTypes = {
  toggleHidden: PropTypes.func.isRequired,
  hidden: PropTypes.bool.isRequired,
  lookupKey: PropTypes.object.isRequired,
};

export default UnhideButton;
