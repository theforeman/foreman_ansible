import React from 'react';
import PropTypes from 'prop-types';
import { TableComposable, Thead, Tr, Th, Tbody } from '@patternfly/react-table';
import { translate as __ } from 'foremanReact/common/I18n';
import { AnsibleRolesTableRow } from './components/AnsibleRolesTableRow';

export const AnsibleRolesTable = props => {
  const searchParams = new URLSearchParams(window.location.search);
  const sortString = searchParams.get('order');

  let sortIndex = null;
  let sortDirection = null;
  if (sortString) {
    const sortStrings = sortString.split(' ');
    sortIndex = sortStrings[0] === 'name' ? 0 : 6;
    // eslint-disable-next-line prefer-destructuring
    sortDirection = sortStrings[1];
  }

  const getSortParams = columnIndex => ({
    sortBy: {
      index: sortIndex,
      direction: sortDirection,
      defaultDirection: 'asc',
    },
    onSort: (_event, index, direction) => {
      if (direction !== null && index !== null) {
        searchParams.set(
          'order',
          `${index === 0 ? 'name' : 'updated_at'} ${direction}`
        );
        window.location.search = searchParams.toString();
      }
    },
    columnIndex,
  });
  return (
    <TableComposable variant="compact" borders="compactBorderless">
      <Thead>
        <Tr>
          <Th sort={getSortParams(0)}>{__('Name')}</Th>
          <Th>{__('Hostgroups')}</Th>
          <Th>{__('Hosts')}</Th>
          <Th>{__('Variables')}</Th>
          <Th sort={getSortParams(6)}>{__('Imported at')}</Th>
          <Th>{__('Actions')}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {props.ansibleRoles.map(role => (
          <AnsibleRolesTableRow key={role.name} ansibleRole={role} />
        ))}
      </Tbody>
    </TableComposable>
  );
};

AnsibleRolesTable.propTypes = {
  ansibleRoles: PropTypes.array,
};

AnsibleRolesTable.defaultProps = {
  ansibleRoles: [],
};
