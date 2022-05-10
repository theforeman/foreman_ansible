import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { Route, Link } from 'react-router-dom';
import Pagination from 'foremanReact/components/Pagination';

import {
  TableComposable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';
import { Flex, FlexItem, Button } from '@patternfly/react-core';

import EditRolesModal from './EditRolesModal';

import withLoading from '../../../withLoading';

const RolesTable = ({
  totalCount,
  history,
  ansibleRoles,
  hostId,
  hostGlobalId,
  canEditHost,
}) => {
  const columns = [__('Name'), __('Variables'), __('Source')];

  const editBtn = canEditHost ? (
    <FlexItem>
      <Link to="/Ansible/roles/edit">
        <Button aria-label="edit ansible roles">
          {__('Edit Ansible roles')}
        </Button>
      </Link>
    </FlexItem>
  ) : null;

  return (
    <React.Fragment>
      <Flex>
        <FlexItem>{editBtn}</FlexItem>
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
                  <Td>
                    <a
                      href={`/ansible/ansible_variables?search=ansible_role=${role.name}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {role.ansibleVariables.totalCount}
                    </a>
                  </Td>
                  <Td>
                    {role.inherited
                      ? __('Inherited from the host group')
                      : __('Directly assigned to the host')}
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
          assignedRoles={ansibleRoles.filter(role => !role.inherited)}
          hostId={hostId}
          canEditHost={canEditHost}
        />
      </Route>
    </React.Fragment>
  );
};

RolesTable.propTypes = {
  ansibleRoles: PropTypes.array.isRequired,
  hostId: PropTypes.number.isRequired,
  hostGlobalId: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  totalCount: PropTypes.number.isRequired,
  canEditHost: PropTypes.bool.isRequired,
};

export default withLoading(RolesTable);
