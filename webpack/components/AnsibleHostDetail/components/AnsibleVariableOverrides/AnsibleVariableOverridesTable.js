import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';

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

import deleteAnsibleVariableOverride from '../../../../graphql/mutations/deleteAnsibleVariableOverride.gql';
import EditableAction from './EditableAction';
import EditableValue from './EditableValue';
import { decodeModelId } from '../../../../globalIdHelper';
import {
  formatSourceAttr,
  findOverride,
  changeOpen,
  changeWorking,
  changeValue,
  setValidationError,
  onCompleted,
  onError,
} from './AnsibleVariableOverridesTableHelper';

import withLoading from '../../../withLoading';

const AnsibleVariableOverridesTable = ({
  variables,
  hostAttrs,
  hostId,
  hostGlobalId,
}) => {
  const columns = [
    __('Name'),
    __('Ansible Role'),
    __('Type'),
    __('Value'),
    __('Source attribute'),
  ];

  const [editableState, setEditableState] = useState(
    variables.map((variable, idx) => ({
      open: false,
      value: variable.currentValue
        ? variable.currentValue.value
        : variable.defaultValue,
      validation: { key: 'noval', msg: '' },
      working: false,
    }))
  );

  const updateState = idx => (...updaters) => {
    setEditableState(
      editableState.map((item, index) => {
        if (idx === index) {
          return updaters.reduce((memo, updater) => updater(memo), item);
        }
        return item;
      })
    );
  };

  const toggleWorking = idx => label => {
    updateState(idx)(changeWorking);
  };

  const toggleEditable = idx => () => {
    updateState(idx)(changeOpen);
  };

  const onValueChange = (idx, variable) => value => {
    updateState(idx)(changeValue(variable, value));
  };

  const onSubmitSuccess = (idx, variable) => newValue => {
    updateState(idx)(
      changeOpen,
      changeWorking,
      changeValue(variable, newValue)
    );
  };

  const onValidationError = idx => error => {
    updateState(idx)(setValidationError(error), changeWorking);
  };

  const dispatch = useDispatch();
  const [callMutation] = useMutation(deleteAnsibleVariableOverride);

  const deleteAction = (variable, idx) => ({
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
          onConfirm: () => {
            callMutation({
              variables: {
                id: findOverride(variable, hostAttrs.name).id,
                hostId,
                variableId: decodeModelId(variable),
              },
            }).then(onCompleted(onValueChange(idx, variable)), onError); // eslint-disable-line
          },
        })
      );
    },
  });

  const actionsResolver = (variable, idx) => {
    const actions = [];
    if (variable.currentValue?.element === 'fqdn') {
      actions.push(deleteAction(variable, idx));
    }
    return actions;
  };

  return (
    <TableComposable variant="compact">
      <Thead>
        <Tr>
          {columns.map(col => (
            <Th key={col}>{col}</Th>
          ))}
          <Th />
        </Tr>
      </Thead>
      <Tbody>
        {variables.map((variable, idx) => (
          <Tr key={idx}>
            <Td>{variable.key}</Td>
            <Td>{variable.ansibleRoleName}</Td>
            <Td>{variable.parameterType}</Td>
            <Td>
              <EditableValue
                variable={variable}
                editing={editableState[idx].open}
                onChange={onValueChange(idx, variable)}
                value={editableState[idx].value}
                validation={editableState[idx].validation}
                working={editableState[idx].working}
              />
            </Td>
            <Td>{formatSourceAttr(variable)}</Td>
            <Td>
              <EditableAction
                open={editableState[idx].open}
                onClose={toggleEditable(idx)}
                onOpen={toggleEditable(idx)}
                toggleWorking={toggleWorking(idx)}
                variable={variable}
                state={editableState[idx]}
                hostId={hostId}
                hostName={hostAttrs.name}
                hostGlobalId={hostGlobalId}
                onSubmitSuccess={onSubmitSuccess(idx, variable)}
                onValidationError={onValidationError(idx)}
              />
            </Td>
            <Td actions={{ items: actionsResolver(variable, idx) }} />
          </Tr>
        ))}
      </Tbody>
    </TableComposable>
  );
};

AnsibleVariableOverridesTable.propTypes = {
  variables: PropTypes.array.isRequired,
  hostAttrs: PropTypes.object.isRequired,
  hostId: PropTypes.number.isRequired,
  hostGlobalId: PropTypes.string.isRequired,
};

export default withLoading(AnsibleVariableOverridesTable);
