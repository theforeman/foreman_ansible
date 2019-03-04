import React from 'react';
import PropTypes from 'prop-types';

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
        dropdownButtonId="available-ansible-roles-pagination-row-dropdown"
      />
    </div>
    <LoadingState loading={loading}>
      {unassignedRoles.map(role => (
        <AnsibleRole
          key={role.id}
          role={role}
          icon="fa fa-plus-circle"
          onClick={onAddRole}
        />
      ))}
    </LoadingState>
  </ListView>
);

AvailableRolesList.propTypes = {
  unassignedRoles: PropTypes.arrayOf(PropTypes.object).isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number,
    perPage: PropTypes.number,
  }).isRequired,
  itemCount: PropTypes.number.isRequired,
  onListingChange: PropTypes.func.isRequired,
  onAddRole: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default AvailableRolesList;
