import React from 'react';

import { Popover, Icon } from 'patternfly-react';

import GenericPopover from './GenericPopover';


const keyOverlay = (lookupKey, lookupValue, hidden, additionalText) => (
  <Popover id="popover" title='Original value info'>
    <div>
      { additionalText && <span dangerouslySetInnerHTML={{ __html: additionalText }} /> }
      <b>Description: </b>{lookupKey.description}<br/>
      <b>Type: </b> {lookupKey.parameterType}<br/>
      <b>Matcher: </b>{formatMatcher(lookupKey.currentOverride)}<br/>
      <b>Inherited Value: </b>{showLookupValue(hidden, lookupKey, lookupValue)}<br/>
    </div>
  </Popover>
);

const showLookupValue = (hidden, lookupKey, lookupValue) => hidden ? '*****' : lookupKey.defaultValue;

const formatMatcher = (currentOverride) =>
  currentOverride ?
  (currentOverride.element + ' (' + currentOverride.elementName +')') :
  ''

const KeyInfoPopover = ({ lookupKey, lookupValue, hidden, keyWarnings }) => {

  const button = <a href="#" className="popover-pf-info"><Icon type="pf" name={keyWarnings.icon} /></a>;
  return (
    <div style={{ textAlign: 'center' }}>
      <GenericPopover
        popoverOverlay={keyOverlay(lookupKey, lookupValue, hidden, keyWarnings.text)}
        button={button}
      />
    </div>
  );
}

export default KeyInfoPopover;
