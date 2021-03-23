import React from 'react';
import PropTypes from 'prop-types';
import { Popover, OverlayTrigger } from 'patternfly-react';

const GenericPopover = ({
  button,
  popoverText,
  popoverId,
  popoverOverlay,
  trigger,
  placement,
  popoverTitle,
}) => {
  const genericOverlay = (text, id, title) => (
    <Popover id={id} title={title}>
      <div>{text}</div>
    </Popover>
  );

  return (
    <OverlayTrigger
      overlay={
        popoverOverlay || genericOverlay(popoverText, popoverId, popoverTitle)
      }
      placement={placement}
      trigger={trigger}
      rootClose
    >
      {button}
    </OverlayTrigger>
  );
};

GenericPopover.propTypes = {
  button: PropTypes.object.isRequired,
  popoverText: PropTypes.string,
  popoverId: PropTypes.string,
  popoverOverlay: PropTypes.node,
  trigger: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  placement: PropTypes.string,
  popoverTitle: PropTypes.string,
};

GenericPopover.defaultProps = {
  popoverText: null,
  popoverId: null,
  popoverTitle: null,
  placement: 'top',
  trigger: 'click',
  popoverOverlay: null,
};

export default GenericPopover;
