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

import {
  formatValue,
  formatSourceAttr,
} from './AnsibleVariableOverridesTableHelper';

const AnsibleVariableOverridesTable = ({ variables, hostAttrs }) => {
  const columns = [
    __('Name'),
    __('Ansible Role'),
    __('Type'),
    __('Value'),
    __('Source attribute'),
  ];

  return (
    <TableComposable variant="compact">
      <Thead>
        <Tr>
          {columns.map((col, idx) => (
            <Th key={idx}>{col}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {variables.map((variable, idx) => (
          <Tr key={idx}>
            <Td>{variable.key}</Td>
            <Td>{variable.roleName}</Td>
            <Td>{variable.parameterType}</Td>
            <Td>{formatValue(variable)}</Td>
            <Td>{formatSourceAttr(hostAttrs, variable)}</Td>
          </Tr>
        ))}
      </Tbody>
    </TableComposable>
  );
};

AnsibleVariableOverridesTable.propTypes = {
  variables: PropTypes.array.isRequired,
  hostAttrs: PropTypes.object.isRequired,
};

export default AnsibleVariableOverridesTable;
