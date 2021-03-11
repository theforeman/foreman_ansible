import React from 'react';
import { translate as __ } from 'foremanReact/common/I18n';
import { Tooltip, Icon, OverlayTrigger } from 'patternfly-react';

const OrderedRolesTooltip = props => {
  const tooltip = (
    <Tooltip id="assigned-ansible-roles-tooltip">
      <span>
        {__(
          'Use drag and drop to change order of the roles. Ordering of roles is respected for Ansible runs, inherited roles are always before those assigned directly'
        )}
      </span>
    </Tooltip>
  );

  return (
    <OverlayTrigger overlay={tooltip} trigger={['hover', 'focus']}>
      <Icon type="pf" name="info" style={{ 'margin-right': '10px' }} />
    </OverlayTrigger>
  );
};

export default OrderedRolesTooltip;
