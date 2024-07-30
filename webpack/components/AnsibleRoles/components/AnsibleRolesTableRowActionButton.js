import React from 'react';
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownToggle,
  DropdownToggleAction,
  DropdownItem,
} from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { useDispatch } from 'react-redux';
import { OPEN_YAML_IMPORT_FROM_ROLE } from '../../YamlVariablesImporter/YamlVariablesImporterConstants';

export const AnsibleRolesTableRowActionButton = props => {
  const dispatch = useDispatch();

  const [isActionOpen, setIsActionOpen] = React.useState(false);
  const onActionToggle = actionOpen => {
    setIsActionOpen(actionOpen);
  };

  const dropdownItems = [
    <DropdownItem
      key="delete_action"
      component="a"
      data-method="delete"
      target="_blank"
      href={`/ansible/ansible_roles/${props.ansibleRoleId}`}
      data-confirm="»demo_role_11 löschen?«"
    >
      {__('Delete')}
    </DropdownItem>,
    <DropdownItem
      key="from_yaml_btn"
      component="button"
      tooltip="Open modal to import variables from YAML files"
      onClick={() =>
        dispatch({
          type: OPEN_YAML_IMPORT_FROM_ROLE,
          payload: { roleName: props.ansibleRoleName },
        })
      }
    >
      Import Variables from YAML
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
