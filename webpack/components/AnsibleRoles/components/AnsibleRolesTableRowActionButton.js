import React from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownToggleAction,
  DropdownItem,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { translate as __, sprintf } from 'foremanReact/common/I18n';

export const AnsibleRolesTableRowActionButton = props => {
  const [isActionOpen, setIsActionOpen] = React.useState(false);
  const onActionToggle = actionOpen => {
    setIsActionOpen(actionOpen);
  };

  const dropdownItems = [
    <DropdownItem
      key="delete_action"
      component="a"
      data-method="delete"
      href={`/ansible/ansible_roles/${props.ansibleRoleId}`}
      data-confirm={sprintf(__('Delete %s?'), props.ansibleRoleName)}
    >
      {__('Delete')}
    </DropdownItem>,
  ];

  return (
    <React.Fragment>
      <Dropdown
        toggle={
          <DropdownToggle
            id="toggle-split-button-action-primary"
            splitButtonItems={[
              <DropdownToggleAction
                key="action"
                onClick={() => {
                  window.location = `/ansible/ansible_variables?search=ansible_role+%3D+${props.ansibleRoleName}`;
                }}
              >
                {__('Variables')}
              </DropdownToggleAction>,
            ]}
            toggleVariant="default"
            splitButtonVariant="action"
            onToggle={onActionToggle}
          />
        }
        isOpen={isActionOpen}
        dropdownItems={dropdownItems}
      />{' '}
    </React.Fragment>
  );
};

AnsibleRolesTableRowActionButton.propTypes = {
  ansibleRoleId: PropTypes.number,
  ansibleRoleName: PropTypes.string,
};

AnsibleRolesTableRowActionButton.defaultProps = {
  ansibleRoleId: 0,
  ansibleRoleName: '',
};
