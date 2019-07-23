import React from 'react';
import { ListView, Tooltip, OverlayTrigger } from 'patternfly-react';
import classNames from 'classnames';
import { translate as __ } from 'foremanReact/common/I18n';

import AnsibleRoleActionButton from './AnsibleRoleActionButton';
import '../AnsibleRolesSwitcher.scss';

const AnsibleRole = ({ role, icon, onClick, resourceName }) => {
  const text =
    resourceName === 'hostgroup'
      ? __('This Ansible role is inherited from parent host group')
      : __('This Ansible role is inherited from host group');

  const tooltip = (
    <Tooltip id={role.id}>
      <span>{text}</span>
    </Tooltip>
  );

  const clickHandler = (onClickFn, ansibleRole) => event => {
    event.preventDefault();
    onClickFn(ansibleRole);
  };

  const listItem = (click = undefined) => (
    <ListView.Item
      id={role.id}
      className={classNames('listViewItem--listItemVariants', {
        'ansible-role-disabled': role.inherited,
        'ansible-role-movable': !role.inherited,
      })}
      heading={role.name}
      actions={
        role.inherited ? (
          ''
        ) : (
          <AnsibleRoleActionButton icon={icon} role={role} />
        )
      }
      stacked
      onClick={typeof click === 'function' ? click(onClick, role) : click}
    />
  );

  if (role.inherited) {
    return (
      <OverlayTrigger overlay={tooltip} placement="top">
        {listItem()}
      </OverlayTrigger>
    );
  }

  return listItem(clickHandler);
};

export default AnsibleRole;
