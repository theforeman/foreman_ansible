import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import { openConfirmModal } from 'foremanReact/components/ConfirmModal';
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

const AnsibleVariableOverridesTable = ({ variables, hostAttrs, hostId }) => {
  const columns = [
    __('Name'),
    __('Ansible Role'),
    __('Type'),
    __('Value'),
    __('Source attribute'),
  ];

  const dispatch = useDispatch();
  const [callMutation] = usePrepareMutation();

  const deleteAction = variable => ({
    title: __('Delete'),
    onClick: () => {
      dispatch(
        openConfirmModal({
          title: __('Delete Ansible Variable Override'),
          message:
            variable &&
            sprintf(
              __('Are you sure you want to delete override for %s?'),
              variable.key
            ),
          onConfirm: () =>
            callMutation({
              variables: {
                id: findOverride(variable, hostAttrs.name).id,
                hostId,
                variableId: decodeModelId(variable),
              },
            }),
        })
      );
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
    </React.Fragment>
  );
};

AnsibleVariableOverridesTable.propTypes = {
  variables: PropTypes.array.isRequired,
  hostAttrs: PropTypes.object.isRequired,
  hostId: PropTypes.number.isRequired,
};

export default AnsibleVariableOverridesTable;
