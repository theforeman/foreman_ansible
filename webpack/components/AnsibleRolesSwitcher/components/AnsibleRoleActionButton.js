import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from '@patternfly/react-core';
import { PlusCircleIcon, MinusCircleIcon } from '@patternfly/react-icons';

const iconMap = {
  'plus-circle': PlusCircleIcon,
  'minus-circle': MinusCircleIcon,
};

const AnsibleRoleActionButton = ({ icon }) => {
  const IconComponent = iconMap[icon] || PlusCircleIcon;

  return (
    <button href="#" className="role-add-remove-btn">
      <Icon size="2xl">
        <IconComponent />
      </Icon>
    </button>
  );
};

AnsibleRoleActionButton.propTypes = {
  icon: PropTypes.string.isRequired,
};

export default AnsibleRoleActionButton;
