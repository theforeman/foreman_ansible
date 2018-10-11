import React from 'react';
import { ListView, Icon } from 'patternfly-react';
import classNames from 'classnames';

import './styles.scss';

const clickHandler = (onClick, role) => (event) => {
  event.preventDefault();
  onClick(role);
};


const actionButton = (icon, onClick, role) => (
  <button
    href='#'
    onClick={clickHandler(onClick, role)}
    className="role-add-remove-btn"
  >
    <Icon className='fa-2x' type='fa' name={icon} />
  </button>
);

const AnsibleRole = ({ role, icon, onClick }) => (
  <ListView.Item
    id={role.id}
    className={classNames('listViewItem--listItemVariants', { 'ansible-role-disabled': role.inherited })}
    heading={role.name}
    actions={role.inherited ? '' : actionButton(icon, onClick, role)}
    stacked
  />
);

export default AnsibleRole;
