import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';

import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import { openConfirmModal } from 'foremanReact/components/ConfirmModal';
import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { Flex, FlexItem } from '@patternfly/react-core';

import Pagination from 'foremanReact/components/Pagination';
import deleteAnsibleVariableOverride from '../../../../graphql/mutations/deleteAnsibleVariableOverride.gql';
import EditableAction from './EditableAction';
import EditableValue from './EditableValue';
import { decodeModelId } from '../../../../globalIdHelper';
import {
  formatSourceAttr,
  findOverride,
  validateValue,
  onCompleted,
  onError,
} from './AnsibleVariableOverridesTableHelper';

import withLoading from '../../../withLoading';

const reducer = (state, action) =>
  state.map((item, index) => {
    if (action.idx === index) {
      return { ...item, ...action.payload };
    }
    return item;
  });

const initState = vars =>
  vars.map((variable, idx) => ({
    open: false,
    value: variable.currentValue
      ? variable.currentValue.value
      : variable.defaultValue,
    validation: { key: 'noval', msg: '' },
    working: false,
  }));

const AnsibleVariableOverridesTable = ({
  variables,
  hostAttrs,
  hostId,
  hostGlobalId,
  totalCount,
}) => {
  const columns = [
    __('Name'),
    __('Ansible role'),
    __('Type'),
    __('Value'),
    __('Source attribute'),
  ];

  const [editableState, innerDispatch] = useReducer(
    reducer,
    variables,
    initState
  );

  const toggleWorking = idx => flag => {
    innerDispatch({ idx, payload: { working: flag } });
  };

  const setEditable = (idx, flag) => () => {
    innerDispatch({ idx, payload: { open: flag } });
  };

  const onValueChange = (idx, variable) => (e, value) => {
    const payload = {
      value,
      validation: validateValue(variable, value),
    };
    innerDispatch({ idx, payload });
  };

  const onSubmitSuccess = (idx, variable) => newValue => {
    innerDispatch({
      idx,
      payload: {
        open: false,
        working: false,
        value: newValue,
        validation: validateValue(variable, newValue),
      },
    });
  };

  const onValidationError = idx => error => {
    innerDispatch({
      idx,
      payload: {
        working: false,
        validation: { key: 'error', msg: error },
      },
    });
  };

  const dispatch = useDispatch();
  const [callMutation] = useMutation(deleteAnsibleVariableOverride);

  const deleteAction = (variable, idx) => ({
    title: __('Delete'),
    onClick: () => {
      dispatch(
        openConfirmModal({
          title: __('Delete Ansible variable override'),
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
    if (variable.currentValue?.element === 'fqdn' && variable.meta.canEdit) {
      actions.push(deleteAction(variable, idx));
    }
    return actions;
  };

  return (
    <React.Fragment>
      <Flex direction={{ default: 'column' }}>
        <FlexItem align={{ default: 'alignRight' }}>
          <Pagination
            ouiaId="pagination-top"
            updateParamsByUrl
            itemCount={totalCount}
            variant="top"
          />
        </FlexItem>
        <FlexItem>
          <Table ouiaId="table-composable-compact" variant="compact">
            <Thead>
              <Tr ouiaId="row-header">
                {columns.map(col => (
                  <Th key={col}>{col}</Th>
                ))}
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {variables.map((variable, idx) => (
                <Tr key={idx} ouiaId={`row-${idx}`}>
                  <Td>
                    <a href={variable.path}>{variable.key}</a>
                  </Td>
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
                      onClose={setEditable(idx, false)}
                      onOpen={setEditable(idx, true)}
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
          </Table>
        </FlexItem>
        <FlexItem align={{ default: 'alignRight' }}>
          <Pagination
            ouiaId="pagination-bottom"
            updateParamsByUrl
            itemCount={totalCount}
            variant="bottom"
          />
        </FlexItem>
      </Flex>
    </React.Fragment>
  );
};

AnsibleVariableOverridesTable.propTypes = {
  variables: PropTypes.array.isRequired,
  hostAttrs: PropTypes.object.isRequired,
  hostId: PropTypes.number.isRequired,
  hostGlobalId: PropTypes.string.isRequired,
  totalCount: PropTypes.number.isRequired,
};

export default withLoading(AnsibleVariableOverridesTable);
