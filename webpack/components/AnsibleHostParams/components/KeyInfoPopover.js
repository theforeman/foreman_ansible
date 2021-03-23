import React from 'react';
import PropTypes from 'prop-types';
import { Popover, Icon } from 'patternfly-react';

import GenericPopover from './GenericPopover';

import { showLookupValue, formatMatcher } from './AnsibleVariableHelpers';

const KeyInfoPopover = ({ lookupKey, hidden, keyErrors }) => {
  const button = (
    <a href="#" className="popover-pf-info">
      <Icon type="pf" name={keyErrors.icon} />
    </a>
  );

  const keyOverlay = (key, isHidden, text) => (
    <Popover id="popover" title="Original value info">
      <div>
        {text && <span dangerouslySetInnerHTML={{ __html: text }} />}
        <b>Description: </b>
        {key.description}
        <br />
        <b>Type: </b> {key.parameterType}
        <br />
        <b>Matcher: </b>
        {formatMatcher(key.currentOverride)}
        <br />
        <b>Inherited Value: </b>
        {showLookupValue(isHidden, key)}
        <br />
      </div>
    </Popover>
  );

  return (
    <div style={{ textAlign: 'center' }}>
      <GenericPopover
        popoverOverlay={keyOverlay(lookupKey, hidden, keyErrors.text)}
        button={button}
      />
    </div>
  );
};

KeyInfoPopover.propTypes = {
  lookupKey: PropTypes.object.isRequired,
  hidden: PropTypes.bool.isRequired,
  keyErrors: PropTypes.object.isRequired,
};

export default KeyInfoPopover;
