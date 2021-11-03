import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { Route, Link } from 'react-router-dom';
import { usePaginationOptions } from 'foremanReact/components/Pagination/PaginationHooks';

import {
  TableComposable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';
import { Flex, FlexItem, Button, Pagination } from '@patternfly/react-core';

import EditRolesModal from './EditRolesModal';

import withLoading from '../../../withLoading';
import AllRolesModal from './AllRolesModal';
import {
  preparePerPageOptions,
  refreshPage,
} from '../../../../helpers/paginationHelper';

const RolesTable = ({
  totalCount,
  pagination,
  history,
  ansibleRoles,
  hostId,
  hostGlobalId,
  canEditHost,
}) => {
  const columns = [__('Name')];

  const handlePerPageSelected = (event, perPage) => {
    refreshPage(history, { page: 1, perPage });
  };

  const handlePageSelected = (event, page) => {
    refreshPage(history, { ...pagination, page });
  };

  const perPageOptions = preparePerPageOptions(usePaginationOptions());

  const editBtn = canEditHost ? (
    <FlexItem>
      <Link to="/Ansible/roles/edit">
        <Button aria-label="edit ansible roles">
          {__('Edit Ansible Roles')}
        </Button>
      </Link>
    </FlexItem>
  ) : null;

  return (
    <React.Fragment>
      <h3>{__('Assigned Ansible Roles')}</h3>
      <Flex className="pf-u-pt-md">
        {editBtn}
        <FlexItem>
          <Link to="/Ansible/roles/all">
            <Button variant="link">{__('View all assigned roles')}</Button>
          </Link>
        </FlexItem>
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
          </Tr>
        </Thead>
        <Tbody>
          {ansibleRoles.map(role => (
            <Tr key={role.id}>
              <Td>{role.name}</Td>
            </Tr>
          ))}
        </Tbody>
      </TableComposable>
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
  pagination: PropTypes.object.isRequired,
  totalCount: PropTypes.number.isRequired,
  canEditHost: PropTypes.bool.isRequired,
};

export default withLoading(RolesTable);
