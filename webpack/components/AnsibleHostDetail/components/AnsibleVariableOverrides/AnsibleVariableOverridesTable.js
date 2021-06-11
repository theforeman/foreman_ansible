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
  prepareMutation,
  submitDelete,
  findOverride,
} from './AnsibleVariableOverridesTableHelper';

import { decodeId } from '../../../../globalIdHelper';

import ConfirmModal from '../../../ConfirmModal';

const AnsibleVariableOverridesTable = ({
  variables,
  hostAttrs,
  hostId,
  showToast,
}) => {
  const columns = [
    __('Name'),
    __('Ansible Role'),
    __('Type'),
    __('Value'),
    __('Source attribute'),
  ];

  const [toDelete, setToDelete] = useState(null);

  const toggleModal = (overrideToDelete = null) => {
    setToDelete(overrideToDelete);
  };

  const deleteAction = variable => ({
    title: __('Delete'),
    onClick: () => {
      toggleModal(variable);
    },
  });

  const actionsResolver = variable => {
    const actions = [];
    if (variable.currentValue && variable.currentValue.element === 'fqdn') {
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
              <Td>{variable.roleName}</Td>
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
        onClose={toggleModal}
        isOpen={!!toDelete}
        onConfirm={submitDelete(hostId, toDelete ? decodeId(toDelete) : null)}
        prepareMutation={prepareMutation(toggleModal, showToast)}
        record={toDelete ? findOverride(toDelete, hostAttrs.name) : {}}
      />
    </React.Fragment>
  );
};

AnsibleVariableOverridesTable.propTypes = {
  variables: PropTypes.array.isRequired,
  hostAttrs: PropTypes.object.isRequired,
  hostId: PropTypes.number.isRequired,
  showToast: PropTypes.func.isRequired,
};

export default AnsibleVariableOverridesTable;
