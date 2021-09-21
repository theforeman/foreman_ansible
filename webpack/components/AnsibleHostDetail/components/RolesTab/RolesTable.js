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
}) => {
  const columns = [__('Name')];

  const handlePerPageSelected = (event, perPage) => {
    refreshPage(history, { page: 1, perPage });
  };

  const handlePageSelected = (event, page) => {
    refreshPage(history, { ...pagination, page });
  };

  const perPageOptions = preparePerPageOptions(usePaginationOptions());

  return (
    <React.Fragment>
      <h3>{__('Assigned Ansible Roles')}</h3>
      <Flex className="pf-u-pt-md">
        <FlexItem>
          <Link to="/Ansible/roles/edit">
            <Button aria-label="edit ansible roles">
              {__('Edit Ansible Roles')}
            </Button>
          </Link>
        </FlexItem>
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
            {columns.map((col, idx) => (
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
        />
      </Route>
      <Route path="/Ansible/roles/all">
        <AllRolesModal
          onClose={() => history.goBack()}
          isOpen
          hostGlobalId={hostGlobalId}
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
};

export default withLoading(RolesTable);
