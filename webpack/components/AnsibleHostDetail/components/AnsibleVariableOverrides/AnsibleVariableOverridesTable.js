import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
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
  usePrepareMutation,
  findOverride,
} from './AnsibleVariableOverridesTableHelper';

import { decodeModelId } from '../../../../globalIdHelper';

import ConfirmModal from '../../../ConfirmModal';

const AnsibleVariableOverridesTable = ({ variables, hostAttrs, hostId }) => {
  const columns = [
    __('Name'),
    __('Ansible Role'),
    __('Type'),
    __('Value'),
    __('Source attribute'),
  ];

  const [toDelete, setToDelete] = useState(null);

  const [callMutation, { loading }] = usePrepareMutation(setToDelete);

  const deleteAction = variable => ({
    title: __('Delete'),
    onClick: () => {
      setToDelete(variable);
    },
  });

  const actionsResolver = variable => {
    const actions = [];
    if (variable.currentValue?.element === 'fqdn') {
      actions.push(deleteAction(variable));
    }
    return actions;
  };

  return (
    <React.Fragment>
      <TableComposable variant="compact" className="ansible-tab-margin">
        <Thead>
          <Tr>
            {columns.map(col => (
              <Th key={col}>{col}</Th>
            ))}
            <Th />
          </Tr>
        </Thead>
        <Tbody>
          {variables.map(variable => (
            <Tr key={variable.key}>
              <Td>{variable.key}</Td>
              <Td>{variable.ansibleRoleName}</Td>
              <Td>{variable.parameterType}</Td>
              <Td>{formatValue(variable)}</Td>
              <Td>{formatSourceAttr(variable)}</Td>
              <Td actions={{ items: actionsResolver(variable) }} />
            </Tr>
          ))}
        </Tbody>
      </TableComposable>
      <ConfirmModal
        title={__('Delete Ansible Variable Override')}
        text={
          toDelete
            ? sprintf(
                __('Are you sure you want to delete override for %s?'),
                toDelete.key
              )
            : ''
        }
        onClose={setToDelete}
        isOpen={!!toDelete}
        onConfirm={() =>
          callMutation({
            variables: {
              id: findOverride(toDelete, hostAttrs.name).id,
              hostId,
              variableId: decodeModelId(toDelete),
            },
          })
        }
        loading={loading}
      />
    </React.Fragment>
  );
};

AnsibleVariableOverridesTable.propTypes = {
  variables: PropTypes.array.isRequired,
  hostAttrs: PropTypes.object.isRequired,
  hostId: PropTypes.number.isRequired,
};

export default AnsibleVariableOverridesTable;
