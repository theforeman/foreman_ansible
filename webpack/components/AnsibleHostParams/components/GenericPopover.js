import React from 'react'

import { Popover, OverlayTrigger } from 'patternfly-react';

const genericOverlay = ({ popoverText, popoverId, popoverTitle }) => (
  <Popover id={popoverId} title={popoverTitle}>
    <div>
      { popoverText }
    </div>
  </Popover>
);

const GenericPopover = ({ button, popoverText, popoverId, popoverOverlay, trigger, placement, popoverTitle }) => (
    <OverlayTrigger
      overlay={ popoverOverlay || genericOverlay({ popoverText, popoverId, popoverTitle }) }
      placement={ placement || 'top' }
      trigger={ trigger || 'click' }
      rootClose={true}
    >
      { button }
    </OverlayTrigger>
);

export default GenericPopover;
