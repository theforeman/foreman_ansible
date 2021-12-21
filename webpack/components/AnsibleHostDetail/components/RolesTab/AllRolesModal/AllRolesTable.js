import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';

import {
  TableComposable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';
import { Flex, FlexItem } from '@patternfly/react-core';
import Pagination from 'foremanReact/components/Pagination';
import withLoading from '../../../../withLoading';

const AllRolesTable = ({ allAnsibleRoles, totalCount }) => {
  const columns = [__('Name'), __('Source')];

  return (
    <React.Fragment>
      <Flex className="pf-u-pt-md">
        <FlexItem align={{ default: 'alignRight' }}>
          <Pagination updateParamsByUrl itemCount={totalCount} variant="top" />
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
};

export default withLoading(AllRolesTable);
