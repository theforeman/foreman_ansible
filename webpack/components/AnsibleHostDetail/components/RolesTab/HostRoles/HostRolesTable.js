import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { Route } from 'react-router-dom';
import Pagination from 'foremanReact/components/Pagination';

import {
  TableComposable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';
import { Flex, FlexItem } from '@patternfly/react-core';

import EditRolesModal from '../EditRolesModal';

import withLoading from '../../../../withLoading';

const HostRolesTable = ({
  totalCount,
  history,
  ansibleRoles,
  hostId,
  canEditHost,
}) => {
  const columns = [__('Name')];

  return (
    <React.Fragment>
      <Flex direction={{ default: 'column' }} className="pf-u-pt-md">
        <FlexItem align={{ default: 'alignRight' }}>
          <Pagination updateParamsByUrl itemCount={totalCount} variant="top" />
        </FlexItem>
      </Flex>
      <Flex direction={{ default: 'column' }}>
        <FlexItem>
          <TableComposable variant="compact">
            <Thead>
              <Tr>
                {columns.map(col => (
                  <Th key={col}>{col}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {ansibleRoles.map(role => (
                <Tr key={role.id}>
                  <Td>
                    <a href={role.path}>{role.name}</a>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </TableComposable>
        </FlexItem>
        <FlexItem align={{ default: 'alignRight' }}>
          <Pagination
            updateParamsByUrl
            itemCount={totalCount}
            variant="bottom"
          />
        </FlexItem>
      </Flex>
      <Route path="/Ansible/roles/edit">
        <EditRolesModal
          closeModal={() => history.goBack()}
          isOpen
          assignedRoles={ansibleRoles}
          hostId={hostId}
          canEditHost={canEditHost}
        />
      </Route>
    </React.Fragment>
  );
};

HostRolesTable.propTypes = {
  ansibleRoles: PropTypes.array.isRequired,
  hostId: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
  totalCount: PropTypes.number.isRequired,
  canEditHost: PropTypes.bool.isRequired,
};

export default withLoading(HostRolesTable);
