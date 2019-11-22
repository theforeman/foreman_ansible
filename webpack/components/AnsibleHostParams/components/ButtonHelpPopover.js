import React from 'react';
import PropTypes from 'prop-types';

import GenericPopover from './GenericPopover';

const ButtonHelpPopover = ({ button, popoverText, popoverId }) => (
  <GenericPopover
    button={button}
    popoverText={popoverText}
    popoverId={popoverId}
    trigger={['hover', 'focus']}
  />
);

ButtonHelpPopover.propTypes = {
  button: PropTypes.object.isRequired,
  popoverText: PropTypes.string.isRequired,
  popoverId: PropTypes.string.isRequired,
};

export default ButtonHelpPopover;
