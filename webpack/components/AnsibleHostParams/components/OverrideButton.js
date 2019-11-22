import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'patternfly-react';
import { translate as __ } from 'foremanReact/common/I18n';

import ButtonHelpPopover from './ButtonHelpPopover';

const OverrideButton = ({ toggleField, fieldOverriden, keyId }) => {
  let faIcon;
  let popoverText;
  let popoverId;

  if (!fieldOverriden) {
    faIcon = 'fa-pencil-square-o';
    popoverText = __('Override this value');
    popoverId = `lookup-key-add-override-${keyId}`;
  } else {
    faIcon = 'fa-times';
    popoverText = __('Remove this override');
    popoverId = `lookup-key-remove-override-${keyId}`;
  }

  const button = (
    <Button
      name="button"
      type="button"
      className="btn btn-default btn-md btn-override"
      onClick={toggleField}
    >
      <span className={`fa ${faIcon}`} />
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

OverrideButton.propTypes = {
  toggleField: PropTypes.func.isRequired,
  fieldOverriden: PropTypes.bool.isRequired,
  keyId: PropTypes.number.isRequired,
};

export default OverrideButton;
