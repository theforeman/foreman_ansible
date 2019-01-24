import React from 'react';

import { Icon } from 'patternfly-react';

const clickHandler = (onClick, role) => (event) => {
  event.preventDefault();
  onClick(role);
};

const AnsibleRoleActionButton = ({ icon, onClick, role }) => (
  <button
    href='#'
    onClick={clickHandler(onClick, role)}
    className="role-add-remove-btn"
  >
    <Icon className='fa-2x' type='fa' name={icon} />
  </button>
);

export default AnsibleRoleActionButton;
