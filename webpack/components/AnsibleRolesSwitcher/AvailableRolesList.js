import React from 'react';

import { ListView, LoadingState } from 'patternfly-react';
import PaginationWrapper from 'foremanReact/components/Pagination/PaginationWrapper';

import AnsibleRole from './AnsibleRole';

const AvailableRolesList = ({
  unassignedRoles,
  pagination,
  itemCount,
  onListingChange,
  onAddRole,
  loading,
}) => (
  <ListView>
    <div className="sticky-pagination">
      <PaginationWrapper
        viewType="list"
        itemCount={itemCount}
        pagination={pagination}
        onChange={onListingChange}
        dropdownButtonId='available-ansible-roles-pagination-row-dropdown'
      />
    </div>
    <LoadingState loading={loading} >
      { unassignedRoles.map(role => <AnsibleRole key={role.id} role={role} icon='fa fa-plus-circle' onClick={onAddRole}/>) }
    </LoadingState>
  </ListView>
);

export default AvailableRolesList;
