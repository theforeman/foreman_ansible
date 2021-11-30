import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';

import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import { usePaginationOptions } from 'foremanReact/components/Pagination/PaginationHooks';
import { openConfirmModal } from 'foremanReact/components/ConfirmModal';
import {
  TableComposable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';
import { Flex, FlexItem, Pagination } from '@patternfly/react-core';

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
import {
  preparePerPageOptions,
  refreshPage,
} from '../../../../helpers/paginationHelper';

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
  pagination,
  history,
}) => {
  const columns = [
    __('Name'),
    __('Ansible Role'),
    __('Type'),
    __('Value'),
    __('Source attribute'),
  ];

  const handlePerPageSelected = (event, perPage) => {
    refreshPage(history, { page: 1, perPage });
  };

  const handlePageSelected = (event, page) => {
    refreshPage(history, { ...pagination, page });
  };

  const perPageOptions = preparePerPageOptions(usePaginationOptions());

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

  const onValueChange = (idx, variable) => value => {
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
    if (variable.currentValue?.element === 'fqdn' && variable.meta.canEdit) {
      actions.push(deleteAction(variable, idx));
    }
    return actions;
  };

  return (
    <React.Fragment>
      <Flex>
        <FlexItem align={{ default: 'alignRight' }}>
          <Pagination
            itemCount={totalCount}
            page={pagination.page}
            perPage={pagination.perPage}
            onSetPage={handlePageSelected}
            onPerPageSelect={handlePerPageSelected}
            perPageOptions={perPageOptions}
            variant="top"
          />
        </FlexItem>
      </Flex>
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
      </TableComposable>
    </React.Fragment>
  );
};

AnsibleVariableOverridesTable.propTypes = {
  variables: PropTypes.array.isRequired,
  hostAttrs: PropTypes.object.isRequired,
  hostId: PropTypes.number.isRequired,
  hostGlobalId: PropTypes.string.isRequired,
  totalCount: PropTypes.number.isRequired,
  pagination: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withLoading(AnsibleVariableOverridesTable);
