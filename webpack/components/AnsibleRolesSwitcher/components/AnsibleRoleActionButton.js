import React from 'react';

import { Icon } from 'patternfly-react';

const AnsibleRoleActionButton = ({ icon, role }) => (
  <button
    href='#'
    className="role-add-remove-btn"
  >
    <Icon className='fa-2x' type='fa' name={icon} />
  </button>
);

export default AnsibleRoleActionButton;
