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

import withLoading from '../../../withLoading';

const RolesTable = props => {
  const columns = [__('Name')];

  return (
    <React.Fragment>
      <h3>{__('Assigned Ansible Roles')}</h3>
      <TableComposable variant="compact">
        <Thead>
          <Tr>
            {columns.map((col, idx) => (
              <Th key={col}>{col}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {props.ansibleRoles.map(role => (
            <Tr key={role.id}>
              <Td>{role.name}</Td>
            </Tr>
          ))}
        </Tbody>
      </TableComposable>
    </React.Fragment>
  );
};

RolesTable.propTypes = {
  ansibleRoles: PropTypes.array.isRequired,
};

export default withLoading(RolesTable);
