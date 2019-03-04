import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'patternfly-react';

const AnsibleRoleActionButton = ({ icon }) => (
  <button href="#" className="role-add-remove-btn">
    <Icon className="fa-2x" type="fa" name={icon} />
  </button>
);

AnsibleRoleActionButton.propTypes = {
  icon: PropTypes.string.isRequired,
};

export default AnsibleRoleActionButton;
