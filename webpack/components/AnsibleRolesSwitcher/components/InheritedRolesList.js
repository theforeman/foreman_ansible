import React from 'react';
import PropTypes from 'prop-types';
import { Title, Tooltip } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';

const InheritedRolesList = ({ roles, resourceName }) => {
  if (roles.length === 0) {
    return null;
  }

  const tooltipText =
    resourceName === 'hostgroup'
      ? __('This Ansible role is inherited from parent host group')
      : __('This Ansible role is inherited from host group');

  return (
    <div className="ansible-inherited-roles">
      <Title
        headingLevel="h2"
        size="md"
        className="ansible-inherited-roles-title"
        ouiaId="inherited-ansible-roles-title"
      >
        {__('Inherited Ansible Roles')}
      </Title>
      <ul>
        {roles.map(role => (
          <li key={role.id}>
            <Tooltip content={<span>{tooltipText}</span>}>
              <span>{role.name}</span>
            </Tooltip>
          </li>
        ))}
      </ul>
    </div>
  );
};

InheritedRolesList.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.object).isRequired,
  resourceName: PropTypes.string.isRequired,
};

export default InheritedRolesList;
