import React from 'react';
import { ListView } from 'patternfly-react';
import classNames from 'classnames';

import AnsibleRoleActionButton from './AnsibleRoleActionButton';
import '../AnsibleRolesSwitcher.scss';

const AnsibleRole = ({ role, icon, onClick }) => (
  <ListView.Item
    id={role.id}
    className={classNames('listViewItem--listItemVariants', { 'ansible-role-disabled': role.inherited })}
    heading={role.name}
    actions={role.inherited ?
             '' :
             <AnsibleRoleActionButton icon={icon} onClick={onClick} role={role}/>}
    stacked
  />
);

export default AnsibleRole;
