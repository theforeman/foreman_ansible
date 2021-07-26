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
    <TableComposable variant="compact" className="ansible-tab-margin">
      <Thead>
        <Tr>
          {columns.map(col => (
            <Th key={col}>{col}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {variables.map(variable => (
          <Tr key={variable.key}>
            <Td>{variable.key}</Td>
            <Td>{variable.ansibleRoleName}</Td>
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
