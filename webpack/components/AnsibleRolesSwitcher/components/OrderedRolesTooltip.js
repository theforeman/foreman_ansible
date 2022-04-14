import React from 'react';
import { translate as __ } from 'foremanReact/common/I18n';
import { Tooltip } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';

const OrderedRolesTooltip = props => {
  const content = (
    <span>
      {__(
        'Use drag and drop to change order of the roles. Ordering of roles is respected for Ansible runs, inherited roles are always before those assigned directly'
      )}
    </span>
  );

  return (
    <Tooltip content={content}>
      <InfoCircleIcon style={{ marginRight: '10px' }} />
    </Tooltip>
  );
};

export default OrderedRolesTooltip;
