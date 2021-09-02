import PropTypes from 'prop-types';
import React from 'react';
import PropTypes from 'prop-types';
import { ListView, Tooltip, OverlayTrigger } from 'patternfly-react';
import classNames from 'classnames';
import { translate as __ } from 'foremanReact/common/I18n';

import AnsibleRoleActionButton from './AnsibleRoleActionButton';
import '../AnsibleRolesSwitcher.scss';

const AnsibleRole = ({ role, icon, onClick, resourceName, index }) => {
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

  const headingText = (name, idx) =>
    idx || idx === 0 ? `${idx + 1}. ${name}` : name;

  const listItem = (click = undefined) => (
    <ListView.Item
      id={role.id}
      className={classNames('listViewItem--listItemVariants', {
        'ansible-role-disabled': role.inherited,
        'ansible-role-movable': !role.inherited,
      })}
      heading={headingText(role.name, index)}
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

AnsibleRole.propTypes = {
  icon: PropTypes.string,
  index: PropTypes.number,
  onClick: PropTypes.func,
  resourceName: PropTypes.string,
  role: PropTypes.shape({
    id: PropTypes.number,
    inherited: PropTypes.bool,
    name: PropTypes.string,
  }),
};

AnsibleRole.defaultProps = {
  icon: undefined,
  index: undefined,
  onClick: undefined,
  resourceName: undefined,
  role: {
    id: undefined,
    inherited: false,
    name: '',
  },
};

AnsibleRole.defaultProps = {
  resourceName: 'host',
};

export default AnsibleRole;
