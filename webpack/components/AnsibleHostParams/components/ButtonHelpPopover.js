import React from 'react';

import GenericPopover from './GenericPopover';

const buttonHelpPopover = (button, popoverText, popoverId) => (
    <OverlayTrigger
      overlay={buttonHelpOverlay(popoverText, popoverId)}
      placement='top'
      trigger='hover'
      rootClose={true}
    >
      { button }
    </OverlayTrigger>
);

const buttonHelpOverlay = (popoverText, popoverId, popoverTitle) => (
  <Popover id={popoverId} title={popoverTitle}>
    <div>
      { popoverText }
    </div>
  </Popover>
);

const ButtonHelpPopover = ({ button, popoverText, popoverId }) => {
  return (
    <GenericPopover
      button={button}
      popoverText={popoverText}
      popoverId={popoverId}
      trigger='hover'
    />
  )
}

export default ButtonHelpPopover;
