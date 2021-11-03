import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { usePaginationOptions } from 'foremanReact/components/Pagination/PaginationHooks';

import {
  TableComposable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';

import { Flex, FlexItem, Pagination } from '@patternfly/react-core';
import withLoading from '../../../../withLoading';
import {
  preparePerPageOptions,
  refreshPage,
} from '../../../../../helpers/paginationHelper';

const AllRolesTable = ({
  allAnsibleRoles,
  totalCount,
  pagination,
  history,
}) => {
  const columns = [__('Name'), __('Source')];

  const handlePerPageSelected = (event, allPerPage) => {
    refreshPage(history, { allPage: 1, allPerPage });
  };

  const handlePageSelected = (event, allPage) => {
    refreshPage(history, { ...pagination, allPage });
  };

  const perPageOptions = preparePerPageOptions(usePaginationOptions());

  return (
    <React.Fragment>
      <Flex className="pf-u-pt-md">
        <FlexItem align={{ default: 'alignRight' }}>
          <Pagination
            itemCount={totalCount}
            page={pagination.allPage}
            perPage={pagination.allPerPage}
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
            <Th />
            {columns.map(col => (
              <Th key={`${col}-all`}>{col}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {allAnsibleRoles.map(role => (
            <Tr key={`${role.id}-all`} id={role.id}>
              <Td />
              <Td>{role.name}</Td>
              <Td>
                {role.inherited
                  ? __('Inherited from Hostgroup')
                  : __('Directly assigned to Host')}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </TableComposable>
    </React.Fragment>
  );
};

AllRolesTable.propTypes = {
  allAnsibleRoles: PropTypes.array.isRequired,
  totalCount: PropTypes.number.isRequired,
  pagination: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withLoading(AllRolesTable);
