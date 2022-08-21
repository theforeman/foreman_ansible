import React from 'react';
import PropTypes from 'prop-types';

import { ListView, LoadingState } from 'patternfly-react';
import Pagination from 'foremanReact/components/Pagination';

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
      <Pagination
        viewType="list"
        itemCount={itemCount}
        updateParamsByUrl={false}
        page={pagination.page}
        perPage={pagination.perPage}
        onChange={onListingChange}
        dropdownButtonId="available-ansible-roles-pagination-row-dropdown"
      />
    </div>
    <LoadingState loading={loading}>
      {unassignedRoles.map((role, index) => (
        <AnsibleRole
          key={role.id}
          role={role}
          icon="fa fa-plus-circle"
          onClick={onAddRole}
          index={index}
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
