import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { Route, Link } from 'react-router-dom';
import Pagination from 'foremanReact/components/Pagination';

import { Table, Thead, Tbody, Tr, Th, Td } from '@patternfly/react-table';
import { Flex, FlexItem, Button } from '@patternfly/react-core';

import EditRolesModal from './EditRolesModal';

import withLoading from '../../../withLoading';
import AllRolesModal from './AllRolesModal';

const RolesTable = ({
  totalCount,
  history,
  ansibleRoles,
  hostId,
  hostGlobalId,
  canEditHost,
}) => {
  const columns = [__('Name'), __('Variables')];

  const editBtn = canEditHost ? (
    <FlexItem>
      <Link to="/Ansible/roles/edit">
        <Button
          aria-label="edit ansible roles"
          ouiaId="edit-ansible-roles-button"
        >
          {__('Edit Ansible roles')}
        </Button>
      </Link>
    </FlexItem>
  ) : null;

  return (
    <React.Fragment>
      <Flex>
        <FlexItem>
          <h3>
            <span>{__('Ansible roles assigned directly to host')}</span>
            <span>{' - '}</span>
            <Link to="/Ansible/roles/all">{__('view all assigned roles')}</Link>
          </h3>
        </FlexItem>
      </Flex>
      <Flex>
        <FlexItem>{editBtn}</FlexItem>
        <FlexItem align={{ default: 'alignRight' }}>
          <Pagination
            ouiaId="pagination-top"
            updateParamsByUrl
            itemCount={totalCount}
            variant="top"
          />
        </FlexItem>
      </Flex>
      <Flex direction={{ default: 'column' }}>
        <FlexItem>
          <Table variant="compact" ouiaId="table-composable-compact">
            <Thead>
              <Tr ouiaId="row-header">
                {columns.map(col => (
                  <Th key={col}>{col}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {ansibleRoles.map(role => (
                <Tr key={role.id} ouiaId={`row-${role.id}`}>
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
      <Route path="/Ansible/roles/edit">
        <EditRolesModal
          closeModal={() => history.goBack()}
          isOpen
          assignedRoles={ansibleRoles}
          hostId={hostId}
          canEditHost={canEditHost}
        />
      </Route>
      <Route path="/Ansible/roles/all">
        <AllRolesModal
          onClose={() => history.push('/Ansible/roles')}
          isOpen
          hostGlobalId={hostGlobalId}
          history={history}
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
