import React from 'react';
import PropTypes from 'prop-types';
import { Tr, Td } from '@patternfly/react-table';
import { AnsibleRolesTableRowActionButton } from './AnsibleRolesTableRowActionButton';

export const AnsibleRolesTableRow = props => (
  <Tr>
    <Td dataLabel="name">{props.ansibleRole.name}</Td>
    <Td dataLabel="hostgroups">
      <a href={`/hostgroups?search=ansible_role+%3D+${props.ansibleRole.name}`}>
        {props.ansibleRole.hostgroupsCount}
      </a>
    </Td>
    <Td dataLabel="hosts">
      <a href={`/hosts?search=ansible_role+%3D+${props.ansibleRole.name}`}>
        {props.ansibleRole.hostsCount}
      </a>
    </Td>
    <Td dataLabel="Variablen">
      <a
        href={`/ansible/ansible_variables?search=ansible_role+%3D+${props.ansibleRole.name}`}
      >
        {props.ansibleRole.variablesCount}
      </a>
    </Td>
    <Td dataLabel="imported">{props.ansibleRole.importTime}</Td>
    <Td dataLabel="actions">
      <AnsibleRolesTableRowActionButton
        ansibleRoleName={props.ansibleRole.name}
        ansibleRoleId={props.ansibleRole.id}
      />
    </Td>
  </Tr>
);

AnsibleRolesTableRow.propTypes = {
  ansibleRole: PropTypes.object,
};

AnsibleRolesTableRow.defaultProps = {
  ansibleRole: {},
};
