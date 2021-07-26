import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';

import {
  TableComposable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';

import withLoading from '../../../../withLoading';

const AllRolesTable = props => {
  const columns = [__('Name'), __('Source')];

  return (
    <TableComposable variant="compact">
      <Thead>
        <Tr>
          <Th />
          {columns.map(col => (
            <Th key={`${col}-all`}>{col}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {props.allAnsibleRoles.map(role => (
          <Tr key={`${role.id}-all`} id={role.id}>
            <Td />
            <Td>{role.name}</Td>
            <Td>
              {role.inherited
                ? __('Inherited from Hostgroup')
                : __('Directly assigned to Host')}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </TableComposable>
  );
};

AllRolesTable.propTypes = {
  allAnsibleRoles: PropTypes.array.isRequired,
};

export default withLoading(AllRolesTable);
